/**
 * Client side script for the OracleOfOmaha web engine
 * Created by Lawrence Waller on 10/21/15.
 */

var loggedIn = false; //stores if someone is logged in
var whoIsLoggedIn = null; //if someone is logged in, stores that user's identity

/* AJAX request function that doesn't require response */
function getPage(url) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

/* AJAX request function that requires response */
function getPageWithCallback(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }

    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

/* Function invoked by show stocks button */
function showStocks(){
    getPageWithCallback("http://127.0.0.1:8080/getID?id=" + whoIsLoggedIn, function(flag){

        var myNode = document.getElementById("displayWindow");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var textNode = document.createTextNode(flag);
        myNode.appendChild(textNode);

    });
}

/* Function invoked by get quote button */
function getQuote(stock){
    var stockJSON;
    getPageWithCallback("http://127.0.0.1:8080/liststock?stockID=" + stock, function(flag){
        stockJSON = JSON.parse(flag);

        var myNode = document.getElementById("displayWindow");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var textNode = document.createTextNode(stockJSON.name + ": $" + stockJSON.lastTradePriceOnly + " per share as of " + new Date());
        myNode.appendChild(textNode);
    });
}

/* Function invoked by add stock button */
function addStock(stock){
    getPageWithCallback("http://127.0.0.1:8080/addStock?id=" + whoIsLoggedIn + "&stocksymbol=" + stock, function(flag){
        var myNode = document.getElementById("displayWindow");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var textNode = document.createTextNode("You have added stock " + stock + " to your portfolio.");
        myNode.appendChild(textNode);
    });
}

/* Function invoked by rm stock button */
function rmStock(stock){
    getPageWithCallback("http://127.0.0.1:8080/removeStock?id=" + whoIsLoggedIn + "&stocksymbol=" + stock, function(flag){
        var myNode = document.getElementById("displayWindow");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var textNode = document.createTextNode("You have removed stock " + stock + " from your portfolio.");
        myNode.appendChild(textNode);
    });
}

/* Function invoked by add rule button */
function addRule(symbol, transactType, price, quantity){
    getPageWithCallback("http://127.0.0.1:8080/trackRule?id=" + whoIsLoggedIn
        + "&stockSymbol=" + symbol
        + "&buyOrSell=" + transactType
        + "&price=" + price
        + "&quantity=" + quantity,

        function(response) {
            var myNode = document.getElementById("displayWindow");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            var textNode = document.createTextNode(response);
            myNode.appendChild(textNode);
        }
    );
}

/* Function invoked by sign up button */
function signUp(){
    var name = prompt("Enter your name", "");
    if (name === "") {
        alert('Fill out the form properly, please!');
        signUp();
    }
    if (name === null){
        alert('Maybe another time, then.');
        return;
    }
    getPage("http://127.0.0.1:8080/addUser?name=" + name);
    alert(name + ", you are now signed up. Now go make some great deals!");
}


function enableDisableForms(enable){
    var showStocks = document.getElementById('showStocksID');
    var addStocks = document.getElementById('addStockID');
    var rmStocks = document.getElementById('rmStockID');
    var addRule = document.getElementById('addRuleID');

    var box1 = document.getElementById("logInToShowStocks");
    var box2 = document.getElementById("logInToAddStock");
    var box3 = document.getElementById("logInToRmStock");
    var box4 = document.getElementById("logInToAddRule");

    //enable or disable buttons on forms
    box1.disabled = !enable;
    box2.disabled = !enable;
    box3.disabled = !enable;
    box4.disabled = !enable;

    var color;

    //if enable is true, we are logging in, we want to enable all the forms and change them to green
    if(enable){
        color = 'lightgreen';
        box1.value = "Show Stocks";
        box2.value = "Add Stock";
        box3.value = "Remove Stock";
        box4.value = "Add Rule";
    }
    //if enable is false, we are logging out, we want to disable and red-out some forms
    else{
        color = 'lightpink';
        box1.value = box2.value = box3.value = box4.value = "Log in to enable";
    }

    //change color of login-dependent forms
    showStocks.style.backgroundColor = addStocks.style.backgroundColor =
        rmStocks.style.backgroundColor = addRule.style.backgroundColor = color;

}

/* Function invoked by log in button */
function logIn(){
    if(loggedIn){ //we are logged in now, and this is a logout request
        whoIsLoggedIn = null;
        loggedIn = false;
        document.getElementById("logInOutButton").innerHTML = "Log In";
        alert("You are logged out.");
        document.getElementById("viewTutorialButton").style.visibility = "visible";

        enableDisableForms(false);
        return;
    }
    //otherwise, we are not logged in, and this is a login request
    var name = prompt("Enter your name", "");
    if (name === "") {
        alert('Fill out the form properly, please!');
        signUp();
    }
    if (name === null){
        alert('Maybe another time, then.');
        return;
    }

    var boolean;

    getPageWithCallback("http://127.0.0.1:8080/searchUser?name=" + name, function(flag){
        if(flag==="true"){
            boolean = true;
            alert("Welcome, " + name + "! You are logged in.");
            loggedIn = true;
            whoIsLoggedIn = name;
            document.getElementById("logInOutButton").innerHTML = "Logout " + whoIsLoggedIn;
            document.getElementById("viewTutorialButton").style.visibility = "hidden";

            enableDisableForms(true);
        }
        else{
            boolean = false;
            alert("Sorry, " + name + " is not a registered user. Sign up at left!");
        }
    });

}