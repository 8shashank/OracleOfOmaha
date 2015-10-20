var models=require('./models');
var Stock=models.Stock;
var Transaction=models.Transaction;
var PortfolioAsset=models.PortfolioAsset;
var moneyAsset="$$MONEY";       //Constant

//Function to call to buy stock
function buyStock(user,stock, price, amount){
    console.log(user, stock, price, amount);
    var portfolio=user.portfolio;
    var userBalance=user.portfolio[moneyAsset];
    var totalPurchaseCost=price*amount;

    //Check that user has required balance to purchase this stock
    if (userBalance.amount>totalPurchaseCost){
        userBalance.amount-=totalPurchaseCost;

        //If stock exists in user's portfolio, update amount else create
        //stock in user's portfolio
        if (portfolio[stock]){
            portfolio[stock].amount+=amount;
        }
        else{
            portfolio[stock]=new PortfolioAsset(stock, amount);
        }
        console.log("Bought "+stock+" stock");
        //Remember the transaction in user's history
        user.transactions.push(new Transaction(stock, price, amount, "BOUGHT", Date.now()))
    }
};

//Function to call to sell stock
function sellStock(user, stock, price, amount){
    var portfolio=user.portfolio;
    var userBalance=user.portfolio[moneyAsset];
    var stockToSell=portfolio[stock];
    var totalSellPrice=price*amount;

    //Check that stock exists in user's portfolio and that they have the amount they want to sell
    if(stockToSell && stockToSell.amount>=amount){
        stockToSell.amount-=amount;
        userBalance.amount+=totalSellPrice;
        user.transactions.push(new Transaction(stock, price, amount, "SOLD", Date.now()))
    }
};


module.exports={
    buyStock: buyStock,
    sellStock: sellStock,
    moneyAsset: moneyAsset
};