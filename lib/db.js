
var redis,
	async = require('async'),
	getFbEvents,
	getMuEvents,
	getEvents,
	addFbEvent,
	addMuEvent,
	rtg,
	fireAndForget,
	facebook_db = 'fb',
	facebook_db_old = facebook_db + '_';
	meetup_db = 'mu',
	meetup_db_old = meetup_db + '_';

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

fireAndForget = function () {};

getFbEvents = function (callback) {
	client.smembers(facebook_db, function (err, res) {
		if (err) {
			callback(err);
		}
		callback(null, res);
	});
}


getMuEvents = function (callback) {
	client.smembers(meetup_db, function (err, res) {
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
	fbIds.unshift(facebook_db);
	client.send_command("sadd", fbIds, callback);
};

addMuEvents = function (muIds, callback) {
	if (typeof muIds === 'string') {
		muIds = [muIds];
	}
	muIds.unshift(meetup_db);
	client.send_command("sadd", muIds, callback);
};

oldFbEvent = function (event) {
	client.smove(facebook_db, facebook_db_old, event, fireAndForget);
}

oldMuEvent = function (event) {
	client.smove(meetup_db, meetup_db_old, event, fireAndForget);
}

exports = module.exports = {
	'getEvents' : getEvents,
	'addFbEvent' : addFbEvents,
	'addMuEvent' : addMuEvents,
	'addFbEvents' : addFbEvents,
	'addMuEvents' : addMuEvents,
	'oldFbEvent': oldFbEvent,
	'oldMuEvent': oldMuEvent
};

