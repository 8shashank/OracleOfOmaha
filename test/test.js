var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

var models=require('../models')
var rules=require('../rules');

describe('Rules', function(){
    /*
    beforeEach(function(){
    //Normal portfolio
        var testPortfolio1={"AAPL": new models.PortfolioAsset('AAPL',5000),
            "GOOG": new models.PortfolioAsset('GOOG', 2000),
            "$$MONEY": new models.PortfolioAsset('$$MONEY', 10)};

    //money only portfolio
        var testPortfolio2={"$$MONEY": new models.PortfolioAsset('$$MONEY', 1000)};

    //No money portfolio
        var testPortfolio3={"AAPL": new models.PortfolioAsset('AAPL',5000),
            "GOOG": new models.PortfolioAsset('GOOG', 2000),
            "$$MONEY": new models.PortfolioAsset('$$MONEY', 10)};
    });
*/

    it('Rule should properly sell when value goes above amount', function(){
        var testPortfolio={
            'GOOG': new models.PortfolioAsset('GOOG', 200),
            'MSFT': new models.PortfolioAsset('MSFT', 100)
        };
        var testMarket={
            'GOOG': new models.Stock('Google', 'GOOG', 90),
            'MSFT': new models.Stock('Microsoft', 'MSFT', 150)
        };
       var sellGoogIfMoreThan100Rule=rules.makeRule('GOOG', 100, 10, 'SELL');
        var testUser=new models.User('Joe', testPortfolio, [], [sellGoogIfMoreThan100Rule]);
        sellGoogIfMoreThan100Rule.execute(testUser, testMarket);

        assert(testPortfolio.GOOG.amount==200, 'Rule sold Google when its price was below 100');

        testMarket.GOOG.price=110;

        sellGoogIfMoreThan100Rule.execute(testUser, testMarket);
        assert(testPortfolio.GOOG.amount==190, 'Rule did not sell Google when its price was above 100');

    });


})