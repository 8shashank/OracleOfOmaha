var express = require('express');
var app = express();
var stockapi = require('./stockapi');
var index = require('./index');
var driver = require('./driver');

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

// can use this to get user id, then query db for their stock info and stuff
app.get('/getID', function (req, res) {
   response = req.query.id;
   console.log(response);
   driver.searchUser(response, function(userData){
   		console.log(userData.portfolio);
   		res.end(JSON.stringify(userData.portfolio));
   });
});

// anyone can get/search for a stock quote using the stock ticker symbol
app.get('/liststock', function (req, res){
	stock = req.query.stockID;
	stockapi.getStockInfo(stock, function(err, data){
		if(err){
			res.end("Stock does not exist");
		}
		else {
			res.end(JSON.stringify(data));
		}
	});
});

app.get('/addStock', function (req, res){
	id = req.query.id;
	stock = req.query.stocksymbol;
	var cb= function(exists) {
		if(!exists) {
			res.end("This stock does not exist");
		}
		else{

			console.log(id, stock);
			driver.addStock(id, stock);
			res.end("You have added " + stock + " to your list of stocks to track. Go back to add more");
		}
	}

	checkValidStockAndCallback(stock, cb);

});

app.get('/removeStock', function (req,res){
	id = req.query.id;
	stock = req.query.stocksymbol;
	console.log(id, stock);
	driver.delStock(id, stock);
	res.end("You have removed " + stock + " from your list of stocks to track");

});

app.get('/trackRule', function(req,res){
	id = req.query.id;
	stockSymbol = req.query.stockSymbol;
	buyorsell = req.query.buyOrSell;
	price = req.query.price;
	addRule(id, stockSymbol, buyorsell, price);

	res.end("You have added the rule for " + stockSymbol + ": " + buyorsell + " price: " + price);
});

function checkValidStockAndCallback(stock, cb) {
	if(index.market[stock]){
		console.log("Exists");
		cb(true);
	}
	else{
		stockapi.getStockInfo(stock, function(err, data){
			//data.name is null when stock does not exist
			if(data.name){
				index.stocklist.push(stock);
				cb(true);
			}
			else {
				cb(false);
			}
		});
	}
}

// could add these functions into another driver file after implementing
// function to attain the account info of id from database
function queryIDinfo(id){

}

// function to add a certain stock to track for that id
function addStockToDB(id, stock){

}

// function to remove a certain stock to track for that id
function removeStockFromDB(id, stock){

}

// function to add rule to db for an id
function addRule(id, stockSymbol, buyOrSell, price){

}
var server = app.listen(8080, function () {
  console.log("Server listening at http://localhost:8080");
});

index.addTestVals();
//Run the update function for the first time immediately
index.update();
//Run the update function every 5 seconds from now on
var runner=setInterval(index.update,5000);
//Reset flags so that rules only executed once every 12 hours
var ruleUpdater=setInterval(index.resetRuleFlags, 60*60*12);