var meetup = require('meetup-api')(process.env.MU_KEY),
	async = require('async');


var makeEvent = function(jsonEvent, callback) {
	console.log("Create event object");
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
	console.log("Run get events");
	meetup.getEvents({'event_id' : eventIds}, function(err,events) {
		console.log("Number of meetup events: " + events.results.length);
		if(err) {
			console.log(err);
			callback(err);
		}
		console.log("For each result in meetup json");
		console.log(events.results.length);
		async.map(events.results, makeEvent, callback);
	});
};
