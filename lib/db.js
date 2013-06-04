
var redis,
	async = require('async'),
	getFbEvents,
	getMuEvents,
	getEvents,
	addFbEvent,
	addMuEvent,
	rtg;

if (process.env.REDISTOGO_URL) {
	rtg   = require("url").parse(process.env.REDISTOGO_URL);
	client = require("redis").createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
} else {
	client = require("redis").createClient();
}


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

addMuEvents = function (muIds, callback) {
	if (typeof muIds === 'string') {
		muIds = [muIds];
	}
	muIds.unshift('mu');
	client.send_command("lpush", muIds, callback);
};

dropAll = function (callback) {
	client.ltrim('mu', -1, 0, function (err, res) {
		if (err) {
			return callback(err);
		}
		client.ltrim('fb',  -1, 0, function (err, res) {
			if (err) {
				return callback(err);
			}
			callback(null, res)
		});
	});
};

exports = module.exports = {
	'getEvents' : getEvents,
	'addFbEvent' : addFbEvents,
	'addMuEvent' : addMuEvents,
	'addFbEvents' : addFbEvents,
	'addMuEvents' : addMuEvents,
	'dropAll' : dropAll
};
