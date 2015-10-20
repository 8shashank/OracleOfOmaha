var yahooFinance = require('yahoo-finance');

function getStockInfo(symbol, cb) {
    yahooFinance.snapshot({
        symbol: symbol,
        //Symbol, Name, Last Trade Price
        // Commented out stuff: Ask(realtime), Bid(realtime), Dividend Yield,
        //P/E Ratio, 50-day Moving Average, 200-day Moving Average,
        //Percent Change From 200-day Moving Average, Percent Change From 50-day Moving Average
        fields: ['s', 'n', 'l1'/*, 'b2','b3', 'y', 'r', 'm3', 'm4', 'm6', 'm8'*/],
    }, cb);
}

function getMultipleStocksInfo(symbols, cb){
    yahooFinance.snapshot({
        symbols: symbols,
        //Symbol, Name, Last Trade Price

        // Commented out stuff: Ask(realtime), Bid(realtime), Dividend Yield,
        //P/E Ratio, 50-day Moving Average, 200-day Moving Average,
        //Percent Change From 200-day Moving Average, Percent Change From 50-day Moving Average
        fields: ['s', 'n', 'l1' /*, 'b2','b3', 'y', 'r', 'm3', 'm4', 'm6', 'm8'*/],
    }, cb);
}

module.exports={
    getStockInfo: getStockInfo,
    getMultipleStocksInfo: getMultipleStocksInfo
}