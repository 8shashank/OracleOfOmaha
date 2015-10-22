/**
 * Client side script for the OracleOfOmaha web engine
 * Created by Lawrence Waller.
 * NOTE: there are not mocha tests for this code because it is client-side JavaScript using AJAX calls, not node
 * The "tests" consist of using the functionality in the GUI within the browser
 */

var loggedIn = false; //stores if someone is logged in
var whoIsLoggedIn = null; //if someone is logged in, stores that user's identity

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
        var mainDiv = document.createElement("div");
        mainDiv.className = "centered"; /* invokes a css section I have set aside in oracleStyle.css */
        myNode.appendChild(mainDiv);
        mainDiv.appendChild(document.createElement("br"));
        var title= document.createElement("span");
        title.style.fontSize = "3em";

        //this escape clause is invoked in case the user entered a stock that does not exist.
        if(stockJSON.name === null){
            title.appendChild(document.createTextNode("That stock does not exist."));
            mainDiv.appendChild(title);
            return;
        }
        title.appendChild(document.createTextNode(stockJSON.name));
        mainDiv.appendChild(title);
        mainDiv.appendChild(document.createElement("br"));
        mainDiv.appendChild(document.createElement("br"));
        var priceDiv = document.createElement("div");
        priceDiv.style.backgroundColor = "lightpink";
        priceDiv.style.display = "inline-block";
        priceDiv.style.padding = "5px";
        priceDiv.style.border = "black";
        priceDiv.style.border = "ridge";
        priceDiv.style.borderWidth = "5px";
        priceDiv.style.borderRadius = "5px";
        priceDiv.style.margin= "0 auto";
        priceDiv.style.marginBottom = "20px";
        priceDiv.style.fontSize = "5em";
        priceDiv.appendChild(document.createTextNode("$" + stockJSON.lastTradePriceOnly.toFixed(2)));
        mainDiv.appendChild(priceDiv);
        mainDiv.appendChild(document.createElement("br"));
        mainDiv.appendChild(document.createTextNode("price per share as of " + new Date()));
    });
}

/* Function invoked by add stock button */
function addStock(stock){
    getPageWithCallback("http://127.0.0.1:8080/addStock?id=" + whoIsLoggedIn + "&stocksymbol=" + stock, function(flag){
        var myNode = document.getElementById("displayWindow");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        var textNode = document.createTextNode("You have begun tracking stock " + stock + ".");
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
        var textNode = document.createTextNode("You have removed stock " + stock + " from your tracking portfolio.");
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
    getPageWithCallback("http://127.0.0.1:8080/addUser?name=" + name, function(response){
        if(response==="false"){
            alert(name + ", you are now signed up. Now go make some great deals!");
        }
        else{
            alert("A user with name " + name + " already exists. Log in at right or choose a different sign-up name.");
        }
    });

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

        //we don't want to leave sensitive information in the display field, so replace with the Warren Buffett placeholder img
        var displayWindow = document.getElementById("displayWindow");
        while (displayWindow.firstChild) {
            displayWindow.removeChild(displayWindow.firstChild);
        }
        var warren = document.createElement("img");
        warren.setAttribute('src', 'http://www.gannett-cdn.com/-mm-/1044cc33457dc55ab3882b134911cd284004350d/c=161-0-4757-3456&r=x404&c=534x401/local/-/media/USATODAY/USATODAY/2014/12/04/635533104145735711-AP-Earns-Berkshire-Hathaway.jpg');
        warren.style.borderRadius = "5px";
        displayWindow.appendChild(warren);
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