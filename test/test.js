var assert = require('assert');
var models=require('../models')
var rules=require('../rules');

describe('Rules', function(){

    describe('Normal cases', function() {
        var testPortfolio = {};
        var testUser = {};
        var testMarket = {};

        beforeEach(function () {
            testPortfolio = {
                'GOOG': new models.PortfolioAsset('GOOG', 200),
                'MSFT': new models.PortfolioAsset('MSFT', 100),
                '$$MONEY': new models.PortfolioAsset('$$MONEY', 1000)
            };
            testMarket = {
                'GOOG': new models.Stock('Google', 'GOOG', 90),
                'MSFT': new models.Stock('Microsoft', 'MSFT', 150)
            };
            testUser = new models.User('Joe', testPortfolio, [], []);
        });

        it('Rule should sell stock when value goes above amount', function () {
            var sellGoogIfMoreThan100Rule = rules.makeRule('GOOG', 100, 10, 'SELL');
            assert.ok(sellGoogIfMoreThan100Rule, "Rule builder returned null for valid request");

            testUser.rules.push(sellGoogIfMoreThan100Rule);

            sellGoogIfMoreThan100Rule.execute(testUser, testMarket);

            assert(testPortfolio.GOOG.amount == 200, 'Rule sold Google when its price was below 100');

            testMarket.GOOG.price = 110;

            sellGoogIfMoreThan100Rule.execute(testUser, testMarket);
            assert(testPortfolio.GOOG.amount == 190, 'Rule did not sell Google when its price was above 100');
            assert(testPortfolio['$$MONEY'].amount == 1000 + 110 * 10, 'Seller did not get the correct amount for their stocks');
        });


        it('Rule should buy stock when value goes below amount', function () {
            var buyGoogIfLessThan100Rule = rules.makeRule('GOOG', 60, 10, 'BUY');
            assert.ok(buyGoogIfLessThan100Rule, "Rule builder returned null for valid request");

            testUser.rules.push(buyGoogIfLessThan100Rule);

            buyGoogIfLessThan100Rule.execute(testUser, testMarket);
            console.log(testPortfolio.GOOG.amount);
            assert(testPortfolio.GOOG.amount == 200, 'Rule bought Google when its price was above 60');

            testMarket.GOOG.price = 50;

            buyGoogIfLessThan100Rule.execute(testUser, testMarket);
            assert(testPortfolio.GOOG.amount == 210, 'Rule did not buy Google when its price was above 100');
            assert(testPortfolio['$$MONEY'].amount == 1000 - 50 * 10, 'Buyer did not pay the correct amount for their stocks');
        });
    });

    describe('Outlier cases', function(){

    });
})