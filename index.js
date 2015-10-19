var stockapi=require('./stockapi');
var RuleBuilder=require('./rules');
var models=require('./models');

var Stock=models.Stock;
var User=models.User;
var PortfolioAsset=models.PortfolioAsset;

//Variable declarations
var database={};    //TODO decide if we are going to save to database or not
var market={};      //Contains Stock objects
var users=[];
var stocklist=['AAPL', 'MSFT'];

//*** Functions to update market

//Executes all rules associated with all users
function updateUsers(){
    users.forEach(function(user){
        console.log(user.name);
        user.rules.forEach(function(rule){
            rule.execute(user, market);
        });
    });
}

//Updates stock prices
function updateMarket(data){
    data.forEach(function(stock){
        var currStock=market[stock.symbol];
        //If stock existed previously, just update price
        if(currStock){
            currStock.price=stock["lastTradePriceOnly"];
        }
        else {
            market[stock.symbol] = new Stock(stock["name"], stock["symbol"], stock["lastTradePriceOnly"]);
        }
        console.log("Updated "+ stock["name"]);
    });
}

//Updates entire application
function update(){
    var cb = function (err, data){
        if(err){
            console.log(err);
            return;
        }
        updateMarket(data);
        updateUsers();
    };

    stockapi.getMultipleStocksInfo(stocklist, cb);
};

function addTestVals(){
    var rules=[RuleBuilder.makeRule('AAPL', 500, 30, 'BUY'), RuleBuilder.makeRule('MSFT', 300, 10, 'SELL')];
    var portfolio={
        "$$MONEY": new PortfolioAsset(moneyAsset, 10000),
        "AAPL": new PortfolioAsset("AAPL", 3000)
    };
    users.push(new User("Joe West", portfolio, rules ));
}

function saveToDatabase(){
    //TODO save existing info to database
};

function loadFromDatabase(){
    //TODO if we have a database, use this to load from it
}

function stopProgram(){
    runner.clearInterval();
    saveToDatabase();
}

addTestVals();

//Run the update function for the first time immediately
update();
//Run the update function every 5 seconds from now on
var runner=setInterval(update,5000);

module.exports={

}
