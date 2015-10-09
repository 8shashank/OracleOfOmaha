var stockapi=require('./stockapi');

stockapi.getStockInfo('AAPL', function(err, response){
    console.log(response);
});

function User(name, transactions, portfolio, rules){
    this.name=name;
    this.transactions=transactions;
    this.portfolio=portfolio;
    this.rules= rules|| [];
}

function Transaction(stock, price, amount, action, timestamp){
    this.stock=stock;
    this.price=price;
    this.amount=amount;
    this.action=action;
    this.timestamp=timestamp;
}

function PortfolioAsset(name, amount){
    this.name=name;
    this.amount=amount;
}