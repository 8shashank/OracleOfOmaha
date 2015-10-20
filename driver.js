var index = require('./index');
var stockapi = require('./stockapi');

function searchUser(user, cb) {
	users = index.users;
	userInfo = null;
	for(i = 0; i < users.length; i++){
		console.log(users[i].name, user);
		if(users[i].name == user){
			userInfo = users[i];
		}
	}
	cb(userInfo);
}

function addStock(user, stock) {
	searchUser(user, function(userData){
		track = userData.track;
		console.log(track);
		if(!track[stock]){
			track[stock] = stock;
		}
		console.log(track);
	});
}

function delStock(user, stock) {
	searchUser(user, function(userData){
		track = userData.track;
		console.log(track);
		if(track[stock]){
			delete track[stock];
		}
		console.log(track);
	})
}

function listUserStockInfo(tracking, res) {
	var userStocks = new Array();
	for(var key in tracking) {
		userStocks.push(tracking[key]);
	}
	console.log(userStocks);
	stockapi.getMultipleStocksInfo(userStocks, function(err, data){
		res.end(JSON.stringify(data));
	})
}

module.exports = {
	searchUser: searchUser,
	addStock: addStock,
	delStock: delStock,
	listUserStockInfo: listUserStockInfo
}