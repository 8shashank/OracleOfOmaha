var express = require('express');
var app = express();
var stockapis = require('./stockapi')

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

// can use this to get user id, then query db for their stock info and stuff
app.get('/getID', function (req, res) {
   response = req.query.id;
   console.log(response);
   queryIDinfo(response);
   res.end(response);
});

// anyone can get/search for a stock quote using the stock ticker symbol
app.get('/liststock', function (req, res){
	response = req.query.stockID;
	stockapis.getStockInfo(response, function(err, snapshot){
		console.log(snapshot);
		res.end(JSON.stringify(snapshot));
	});
});

app.get('/addStock', function (req, res){
	id = req.query.id;
	stock = req.query.stocksymbol;
	console.log(id,stock);
	addStockToDB(id, stock);
	res.end("You have added " + stock + " to your list of stocks to track. Go back to add more");
});

app.get('/removeStock', function (req,res){
	id = req.query.id;
	stock = req.query.stocksymbol;
	console.log(id, stock);
	removeStockFromDB(id, stock);
	res.end("You have removed " + stock + " from your list of stocks to track");

});

app.get('/trackRule', function(req,res){
	id = req.query.id;
	stockSymbol = req.query.stockSymbol;
	buyorsell = req.query.buyOrSell;
	price = req.query.price;
	addRule(id, stockSymbol, buyorsell, price);

	res.end("You have added the rule for " + stockSymbol + ": " + buyorsell + " price: " + price);
})

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