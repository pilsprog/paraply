var meetup = require('meetup-api')(process.env.MU_KEY),
	async = require('async');


var makeEvent = function(jsonEvent, callback) {
	var event = {};
	event.id = jsonEvent.id;
	event.source = jsonEvent.event_url;
	event.date = new Date(jsonEvent.time);
	if(jsonEvent.venue) {
		event.venue = {
						'name': jsonEvent.venue.name,
						'address': jsonEvent.venue.address_1,
						'lon': jsonEvent.venue.lon,
						'lat': jsonEvent.venue.lat
					};
	} else {
		event.venue = {
						'name': '',
						'address': '',
						'lon': jsonEvent.group.lon,
						'lat': jsonEvent.group.lat
					};
	}
	event.arranger = jsonEvent.group.name;
	event.title = jsonEvent.name;
	event.desc = jsonEvent.description;
	event.rsvp = jsonEvent.yes_rsvp;
	callback(null, event);
};


exports.getEvents = function(eventIds, callback) {
	var eventStrings = eventIds.join(',');
	if (eventIds && eventIds.length) {
		meetup.getEvents({'event_id' : eventIds}, function(err, events) {
			if(err) {
				callback(err);
			}
			async.map(events.results, makeEvent, callback);
		});
	} else {
		callback(null, []);
	}
};


exports.getGroupEvents = function(groupname, callback) {
	console.log("groupName var in meetup.js: " + groupname);
	if(groupname) {
		meetup.getEvents({'group_urlname' : groupname}, function(err, events) {
			if(err) {
				callback(err);
			}
			console.log(events);
			async.map(events.results, makeEvent, callback);
		});
	} else {
		callback(null, []);
	}
};
