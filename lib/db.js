
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
	client.smembers('fb', function (err, res) {
		if (err) {
			callback(err);
		}
		callback(null, res);
	});
}


getMuEvents = function (callback) {
	client.smembers('mu', function (err, res) {
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
	client.send_command("sadd", fbIds, callback);
};

addMuEvents = function (muIds, callback) {
	if (typeof muIds === 'string') {
		muIds = [muIds];
	}
	muIds.unshift('mu');
	client.send_command("sadd", muIds, callback);
};


exports = module.exports = {
	'getEvents' : getEvents,
	'addFbEvent' : addFbEvents,
	'addMuEvent' : addMuEvents,
	'addFbEvents' : addFbEvents,
	'addMuEvents' : addMuEvents,
};
