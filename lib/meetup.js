var meetup = require('meetup-api')(process.env.MU_KEY),
	async = require('async'),
	getEvent,
	getEvents,
	makeEvent;


makeEvent = function(jsonEvent, callback) {
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
						'address': ''
					};
	}
	if (jsonEvent.group) {
		event.venue.lon = event.venue.lon || jsonEvent.group.lon;
		event.venue.lat = event.venue.lat || jsonEvent.group.lat;
		event.arranger = jsonEvent.group.name;
	}
	event.title = jsonEvent.name;
	event.desc = jsonEvent.description;
	event.rsvp = jsonEvent.yes_rsvp;
	callback(null, event);
};

getEvent = function (eventId, callback){
	meetup.getEvents({'event_id' : eventId}, function(err, event) {
		if(err) {
			console.log('Error for mu event: ' + eventId);
			return callback(err);
		}
		if (event && event.results && event.results.length) {
			makeEvent(event.results[0], callback);
		} else {
			callback(null, {});
		}
	});
};

exports.getEvents = function(eventIds, callback) {
	async.map(eventIds, getEvent, function (err, list) {
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
};


exports.getGroupEvents = function(groupname, callback) {
	console.log("groupName var in meetup.js: " + groupname);
	if(groupname) {
		meetup.getEvents({'group_urlname' : groupname}, function(err, events) {
			if(err) {
				return callback(err);
			}
			async.map(events.results, makeEvent, callback);
		});
	} else {
		callback(null, []);
	}
};
