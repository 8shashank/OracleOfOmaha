var actions=require('./actions');

function SellIfStockGreaterThan(stock, value, quantityToSell){
    this.value=value;
    this.stock=stock;
    this.quantity=quantityToSell;
    this.alreadyExecuted=false;

    this.execute= function(user, market){
        if(this.alreadyExecuted) {
            return;
        }
        //Sanity check to make sure variables exist
        if (user.portfolio[stock] && market[stock]) {

            var marketPrice = market[stock].price;
            if (marketPrice > value) {
                if(actions.sellStock(user, stock, marketPrice, this.quantity)){
                    this.alreadyExecuted=true;
                };
            }
        }
    };
};

function BuyIfStockLessThan(stock, value, quantityToBuy){
    this.value=value;
    this.stock=stock;
    this.quantity=quantityToBuy;
    this.alreadyExecuted=false;

    this.execute=function(user, market){
        if(this.alreadyExecuted) {
            return;
        }
        //Sanity check to make sure variables exist
        if(market[stock]) {

            var marketPrice=market[stock].price;
            if (marketPrice<value) {
                if(actions.buyStock(user, stock, marketPrice, this.quantity)){
                    this.alreadyExecuted=true;
                };
            }
        }
    };
};

function makeRule(stock, value, quantity, action){
    if (action==="BUY"){
        //Meaning buy 'quantity' amounts of stock if its price is less than 'value'
        return new BuyIfStockLessThan(stock, value, quantity);
    }
    else if (action==="SELL"){
        //Meaning sell 'quantity' amounts of stock if its price is less than 'value'
        return new SellIfStockGreaterThan(stock, value, quantity);
    }
    //Have to check for null after making rule. Do this or return dummy rule?
    return null;
}

module.exports={
    makeRule: makeRule
};
