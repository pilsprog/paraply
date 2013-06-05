'use strict';
var Facebook = require('facebook-node-sdk'),
	async = require('async'),
	facebook = new Facebook({ appId: process.env.FB_ID, secret: process.env.FB_SECRET}),
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
			event.venue.address = data.location.street;
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
		async.map(eventIdList, getEvent, function (err, list) {
			if (err) {
				return callback(err);
			}
			async.filter(list,
				function (el, cb) {
					cb(el.id);
				},
				function (filteredList) {
					callback(null, filteredList);
				}
			)
		});
	});
};


getEvent = function (eventId, callback) {
	var event = {};
	facebook.api('/' + eventId, function (err, fbEvent) {
		if (err) {
			if (err.result.error.code === 100) {
				console.log('Error for fb event: ' + eventId);
				return callback(null, {});
			}
			return callback(err);
		}
		event.id = eventId;
		event.venue = {'id' : fbEvent.venue.id};
		event.source = 'https://www.facebook.com/events/' + eventId;
		event.date = new Date(Date.parse(fbEvent.start_time));
		event.title = fbEvent.name;
		event.desc = fbEvent.description;
		if (fbEvent.owner) {
			event.arranger = fbEvent.owner.name;
		}
		getAttending(event, callback);
	});
};


exports = module.exports = {
	'getEvent' : getEvent,
	'getEvents' : getEvents
};
