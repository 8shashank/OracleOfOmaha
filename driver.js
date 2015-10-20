var index = require('./index');

function searchUser(user, cb) {
	users = index.users;
	for(i = 0; i < users.length; i++){
		console.log(users[i].name, user);
		if(users[i].name == user){
			cb(users[i]);
		}
	}
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

module.exports = {
	searchUser: searchUser,
	addStock: addStock,
	delStock: delStock
}