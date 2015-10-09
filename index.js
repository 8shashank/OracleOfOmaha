var stockapi=require('./stockapi');

stockapi.getStockInfo('AAPL', function(err, response){
    console.log(response);
});