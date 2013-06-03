'use strict';
var config = require('./config'),
	Facebook = require('facebook-node-sdk'),
	async = require('async'),
	facebook = new Facebook({ appId: config.appId, secret: config.appSecret }),
	getEvent,
	getEvents;
facebook.setAccessToken(config.userToken);



getEvents = function (eventIdList, callback) {
	async.map(eventIdList, getEvent, callback);
};


getEvent = function (eventId, callback) {
	var event = {};
	facebook.api('/' + eventId, function (err, fbEvent) {
		if (err) {
			console.log(err);
			callback(err);
		}
		event.source = 'https://www.facebook.com/events/' + eventId;
		event.date = fbEvent.start_date;
		event.title = fbEvent.name;
		event.desc = fbEvent.description;
		if (event.owner) {
			event.arranger = event.owener.name;
		}

		facebook.api('/' + eventId + '/attending', function (err, attending) {
			if (err) {
				callback(err);
			}
			event.rsvp = attending.data;
			if (fbEvent.venue && fbEvent.venue.id) {
				facebook.api('/' + fbEvent.venue.id, function (err, data) {
					event.venue = {};
					event.venue.about = data.about;
					event.venue.attire = data.attire;
					event.venue.category = data.category;
					event.venue.hours = data.hours;
					event.venue.link = data.link;
					if (data.location) {
						event.venue.lon = data.location.longitude;
						event.venue.lat = data.location.latitude;
					}
					event.venue.phone = data.phone;
					callback(null, event);
				});
			} else {
				callback(null, event);
			}
		});
	});
};


exports = module.exports = {
	'getEvent' : getEvent,
	'getEvents' : getEvents
};

