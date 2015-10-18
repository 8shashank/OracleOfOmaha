//Contains stuff that needs to be put in database

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

function Stock(name, price){
    this.name=name;
    this.price=price;
}

module.exports={
  User: User,
  Transaction: Transaction,
  PortfolioAsset: PortfolioAsset,
    Stock: Stock,
}