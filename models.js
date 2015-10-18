//Contains stuff that needs to be put in database

function User(name, portfolio, rules){
    this.name=name;
    this.transactions=[];
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

function PortfolioAsset(symbol, amount){
    this.symbol=symbol;
    this.amount=amount;
}

function Stock(name, symbol, price){
    this.name=name;
    this.symbol=symbol;
    this.price=price;
}

module.exports={
  User: User,
  Transaction: Transaction,
  PortfolioAsset: PortfolioAsset,
    Stock: Stock,
}