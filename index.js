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
var stocklist=['AAPL', 'MSFT', 'GOOG'];

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

function resetRuleFlags(){
    users.forEach(function(user){
        user.rules.forEach(function(rule){
            rule.alreadyExecuted=false;
        })
    })
};

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
    var track = {
        'AAPL': 'AAPL',
        'MSFT': 'MSFT'
    };
    var rules=[RuleBuilder.makeRule('AAPL', 500, 30, 'BUY'), RuleBuilder.makeRule('MSFT', 300, 10, 'SELL')];
    var portfolio={
        "$$MONEY": new PortfolioAsset("$$MONEY", 10000),
        "AAPL": new PortfolioAsset("AAPL", 3000)
    };
    users.push(new User("Joe West", portfolio, track, rules ));
}

function addUser(name){
    var track = {}; 
    var rules = [];
    var portfolio = {
        "$$MONEY" : new PortfolioAsset("$$MONEY", 10000)
    };
    users.push(new User(name, portfolio, track, rules));
}

function stopProgram(){
    runner.clearInterval();
    saveToDatabase();
}

module.exports={
    addTestVals: addTestVals,
    update: update,
    resetRuleFlags: resetRuleFlags,
    market: market,
    users: users,
    stocklist: stocklist,
    addUser: addUser
}
