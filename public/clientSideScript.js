/**
 * Created by Lawrence Waller on 10/21/15.
 */

var loggedIn = false; //stores if someone is logged in
var whoIsLoggedIn = null; //if someone is logged in, stores that user's identity

function getPage(url) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

function getPageWithCallback(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }

    httpRequest.open("GET", url, true);
    httpRequest.send(null);
}

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

function logIn(){
    if(loggedIn){
        whoIsLoggedIn = null;
        loggedIn = false;
        document.getElementById("logInOutButton").innerHTML = "Log In";
        alert("You are logged out.");
        document.getElementById("viewTutorialButton").style.visibility = "visible";
        return;
    }
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
            document.getElementById("logInOutButton").innerHTML = "Click Here to Logout";
            document.getElementById("viewTutorialButton").style.visibility = "hidden";

            var box1 = document.getElementById("logInToShowStocks");
            box1.disabled = false;
            box1.value = "Show Stocks";

            var box2 = document.getElementById("logInToAddStock");
            box2.disabled = false;
            box2.value = "Add Stock";

            var box3 = document.getElementById("logInToRmStock");
            box3.disabled = false;
            box3.value = "Remove Stock";

            var box4 = document.getElementById("logInToAddRule");
            box4.disabled = false;
            box4.value = "Add Rule";
        }
        else{
            boolean = false;
            alert("Sorry, " + name + " is not a registered user. Sign up at left!");
        }
    });

}