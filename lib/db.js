var redis = require('redis'),
	client = redis.createClient(),
	async = require('async'),
	getFbEvents,
	getMuEvents,
	getEvents;

client.on("error", function (err) {
	console.log("Error " + err);
});



getFbEvents = function (callback) {
	client.lrange('fb',0,-1, function (err, res) {
		if (err) {
			callback(err);
		}
		callback(null, res);
	});
}


getMuEvents = function (callback) {
	client.lrange('mu',0,-1, function (err, res) {
		if (err) {
			callback(err);
		}
		callback(null, res);
	});
}

getEvents = function (callback) {
	async.parallel({
			'fb': getFbEvents,
			'mu': getMuEvents
		}, callback);
};

exports = module.exports = {
	'getEvents' : getEvents
}
