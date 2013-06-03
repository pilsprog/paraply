'use strict';
var config = require('./config'),
	Facebook = require('facebook-node-sdk'),
	async = require('async'),
	facebook = new Facebook({ appId: config.appId, secret: config.appSecret }),
	getEvent,
	getEvents,
	getVenue,
	getAttending;

getVenue = function (event, callback) {
	facebook.api('/' + event.venue.id, function (err, data) {
		if (err) {
			return callback(err);
		}
		event.venue.name = data.name
		event.venue.about = data.about;
		event.venue.link = data.link;
		if (data.location) {
			event.venue.lon = data.location.longitude;
			event.venue.address = data.location.stret;
			event.venue.lat = data.location.latitude;
		}
		callback(null, event);
	});
};

getAttending = function (event, callback) {
	facebook.api('/' + event.id + '/attending', function (err, attending) {
		if (err) {
			return callback(err);
		}
		event.rsvp = attending.data.length;
		if (event.venue && event.venue.id) {
			getVenue(event, callback);
		} else {
			callback(null, event);
		}
	});
}

getEvents = function (eventIdList, callback) {
	facebook.getAccessToken(function() {
		async.map(eventIdList, getEvent, callback);
	});
};


getEvent = function (eventId, callback) {
	var event = {};
	facebook.api('/' + eventId, function (err, fbEvent) {
		if (err) {
			return callback(err);
		}
		event.id = eventId;
		event.venue = {'id' : fbEvent.venue.id};
		event.source = 'https://www.facebook.com/events/' + eventId;
		event.date = fbEvent.start_date;
		event.title = fbEvent.name;
		event.desc = fbEvent.description;
		if (event.owner) {
			event.arranger = event.owner.name;
		}
		getAttending(event, callback);
	});
};


exports = module.exports = {
	'getEvent' : getEvent,
	'getEvents' : getEvents
};
