var meetup = require('meetup-api')(process.env.MU_KEY),
	async = require('async');


var makeEvent = function(jsonEvent, callback) {
	var event = {};
	event.id = jsonEvent.id;
	event.source = jsonEvent.event_url;
	event.date = new Date(jsonEvent.time);
	event.venue = {'name': jsonEvent.venue.name,
					'address': jsonEvent.venue.address_1,
					'lon': jsonEvent.venue.lon,
					'lat': jsonEvent.venue.lat};
	event.arranger = jsonEvent.group.name;
	event.title = jsonEvent.name;
	event.desc = jsonEvent.description;
	event.rsvp = jsonEvent.yes_rsvp;
	callback(null, event);
};


exports.getEvents = function(eventIds, callback) {
	if (eventIds && eventIds.length) {
		meetup.getEvents({'event_id' : eventIds}, function(err,events) {
			if(err) {
				callback(err);
			}
			async.map(events.results, makeEvent, callback);
		});
	} else {
		callback(null, []);
	}
};
