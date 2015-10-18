var stockapi=require('./stockapi');
var models=require('./models');
var database={};
var stocklist=['AAPL', 'MSFT'];
var market={};
var users=[];

function updateUsers(){
    users.forEach(function(user){
        user.rules.forEach(function(rule){
            rule.execute();
        });
    });
}

function updateMarket(data){
    data.forEach(function(stock){
        market[stock.symbol]={
            price: stock["lastTradePriceOnly"],
            name: stock["name"]
        }
        console.log("Updated "+ stock["name"]);
    });
}

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
}

function writeFromDatabase(){
    //TODO Import data from database if exists.
};

function saveToDatabase(){
    //TODO save existing info to database
};

function stopProgram(){
    runner.clearInterval();
    saveToDatabase();
}

//Run the update function for the first time immediately
update();
//Run the update function every 5 seconds from now on
var runner=setInterval(update,5000);