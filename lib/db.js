var redis = require('redis'),
	client = redis.createClient(),
	async = require('async'),
	getFbEvents,
	getMuEvents,
	getEvents,
	addFbEvent,
	addMuEvent;

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

addFbEvents = function (fbIds, callback) {
	if (typeof fbIds === 'string') {
		fbIds = [fbIds];
	}
	fbIds.unshift('fb');
	client.send_command("lpush", fbIds, callback);
};

addMuEvents = function (muId, callback) {
	if (typeof fbIds === 'string') {
		fbIds = [fbIds];
	}
	fbIds.unshift('mu');
	client.send_command("lpush", fbIds, callback);
};

exports = module.exports = {
	'getEvents' : getEvents,
	'addFbEvent' : addFbEvents,
	'addMuEvent' : addMuEvents,
	'addFbEvents' : addFbEvents,
	'addMuEvents' : addMuEvents
};
