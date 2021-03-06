var assert = require('assert');
var models=require('../models')
var rules=require('../rules');
var _ = require('lodash');

describe('Actions', function(){
    var testPortfolio = {};
    var testUser = {};
    var testMarket = {};
    var actions=require('../actions');

    describe('Buy Stock', function(){
        beforeEach(function () {
            testPortfolio = {
                'GOOG': new models.PortfolioAsset('GOOG', 200),
                'MSFT': new models.PortfolioAsset('MSFT', 100),
                '$$MONEY': new models.PortfolioAsset('$$MONEY', 1000)
            };
            testUser = new models.User('Joe', testPortfolio, [], []);
        });

        it('Should buy and update stock in user portfolio', function(){
            var prevAmount=testPortfolio.MSFT.amount;
            var prevBalance=testPortfolio.$$MONEY.amount;
            actions.buyStock(testUser,'MSFT', 10, 12);
            assert(testPortfolio.MSFT.amount===prevAmount+12);

            var sellPrice=10*12;
            assert(testPortfolio.$$MONEY.amount===prevBalance-sellPrice);
        });

        it('Should buy and create new portfolio asset for user if did not previously exist', function(){
            var prevBalance=testPortfolio.$$MONEY.amount;
            actions.buyStock(testUser,'AAPL', 10, 12);
            var sellPrice=10*12;
            assert(testPortfolio.AAPL.amount===12);
            assert(testPortfolio.$$MONEY.amount===prevBalance-sellPrice);
        });

        it('Should not buy stock if user does not have enough funds', function(){
            var prevBalance=testPortfolio.$$MONEY.amount;
            var prevAmount=testPortfolio.MSFT.amount;

            actions.buyStock(testUser,'AAPL',1000,10000);
            assert(testPortfolio.AAPL==undefined, "Should not have bought AAPL stock with insufficient funds");
            assert(testPortfolio.$$MONEY.amount===prevBalance);

            actions.buyStock(testUser,'MSFT',1000,1000);
            assert(testPortfolio.MSFT.amount===prevAmount,"Should not have bought MSFT stock with insufficient funds");
            assert(testPortfolio.$$MONEY.amount===prevBalance);
        });
    });

    describe('Sell Stock', function(){
        beforeEach(function () {
            testPortfolio = {
                'GOOG': new models.PortfolioAsset('GOOG', 200),
                'MSFT': new models.PortfolioAsset('MSFT', 100),
                '$$MONEY': new models.PortfolioAsset('$$MONEY', 1000)
            };
            testUser = new models.User('Joe', testPortfolio, [], []);
        });

        it('Should sell and update stock in user portfolio', function(){
            var prevAmount=testPortfolio.MSFT.amount;
            var prevBalance=testPortfolio.$$MONEY.amount;

            actions.sellStock(testUser,'MSFT', 10, 12);
            assert(testPortfolio.MSFT.amount===prevAmount-12);
            var totalSellPrice=10*12;
            assert(testPortfolio.$$MONEY.amount===prevBalance+totalSellPrice);
        });

        it('Should not change stock/money for user if they did not have that stock', function(){
            actions.sellStock(testUser,'AAPL', 10, 12);
            assert(testPortfolio.AAPL==undefined);
        });

        it('Should not sell stock if user does not have the amount they wanted to sell', function(){
            var prevAmount=testPortfolio.MSFT.amount;
            actions.sellStock(testUser,'MSFT',1000,10000);
            assert(testPortfolio.MSFT.amount==prevAmount, "Should not have sold MSFT");

            actions.buyStock(testUser,'AAPL',1000,1000);
            assert(testPortfolio.AAPL==undefined);
        });
    });

});
            

describe('Driver', function(){
    var driver = require('../driver');
    var index = require('../index');

    beforeEach(function(){
        index.addUser("John Doe");
        index.addUser("Jane Doe");
    });

    describe('searchUser', function(){

        it('should return the user portfolio if the user exists', function(){
            driver.searchUser("John Doe", function(userData){
                assert(userData !== null);
            });
            driver.searchUser("Jane Doe", function(userData){
                assert(userData !== null);
            });
        });

        it('should return portfolio as null if the user does not exist', function(){
            driver.searchUser("Invalid User", function(userData){
                assert(userData === null);
            });
        });
    });

    describe('addStock', function(){

        it('should add a valid stock to the list of stocks a user is tracking', function(){
            driver.addStock("John Doe", "GOOG");
            correct = {
                GOOG: 'GOOG'
            }

            driver.searchUser("John Doe", function(userData){
                tracking = userData.track;
                assert(_.isEqual(tracking, correct));
            });
        });
    })

    describe('delStock', function(){

        it('should delete a stock if it exists in the list of user stock tracking', function(){
            driver.addStock("John Doe", "AAPL");
            driver.addStock("John Doe", "MSFT");
            driver.delStock("John Doe", "AAPL");
            correct = {
                MSFT: 'MSFT'
            }

            driver.searchUser("John Doe", function(userData){
                tracking = userData.track;
                assert(_.isEqual(tracking, correct));
            })


        });

        it('should not delete a stock if it does not exist in the list of user stock tracking', function(){
            driver.addStock("John Doe", "AAPL");
            driver.delStock("John Doe", "MSFT");
            correct = {
                AAPL: 'AAPL'
            }

            driver.searchUser("John Doe", function(userData){
                tracking = userData.track;
                assert(_.isEqual(tracking, correct));
            });
        })

        it('should not delete a stock if it is invalid', function(){
            driver.addStock("John Doe", "AAPL");
            driver.delStock("John Doe", "INVALID");

            correct = {
                AAPL: 'AAPL'
            }

            driver.searchUser("John Doe", function(userData){
                tracking = userData.track;
                assert(_.isEqual(tracking, correct));
            })

        })
    });
});

describe('Rules', function(){
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
        var prevAmount=testPortfolio.GOOG.amount;
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

    it('Rule should not be built when passed invalid action', function(){
        var invalidRule=rules.makeRule('GOOG', 50,10,'YABADABADOO');
        assert(invalidRule===null);

        invalidRule=rules.makeRule('GOOG', 50, 10, '');
        assert(invalidRule===null);
    });

    it('Rule should not buy when user does not have enough money', function(){
        var rule=rules.makeRule('GOOG', 210, 3000, 'BUY');
        rule.execute(testUser,testMarket);
        assert(testUser.portfolio.GOOG.amount===200);
    });

    it('Rule should not buy if it has already bought once', function(){
        var buyGoogOnceRule = rules.makeRule('GOOG', 210, 2, 'BUY');
        var prevAmount=testUser.portfolio.GOOG.amount;
        buyGoogOnceRule.execute(testUser, testMarket);
        assert(testUser.portfolio.GOOG.amount===prevAmount+2, "Rule did not execute first time");
        buyGoogOnceRule.execute(testUser, testMarket);
        assert(testUser.portfolio.GOOG.amount===prevAmount+2, "Rule executed twice");
    });
});
