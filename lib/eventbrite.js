'use strict';
var config = require('./config'),
	Eventbrite = require('eventbrite'),
	async = require('async'),
	eventbrite = Eventbrite({'app_key': config.eventbrite_key}),
	getEvent,
	getEvents,
	getAttending;

// TODO get this to work properly
getAttending = function (event, callback) {
	eventbrite.event_list_attendees( {'id': event.id, 'only_display':'quantity'}, function(err, attending){
		if (err) {
			return callback(err);
		}
		console.log(JSON.stringify(attending, null, 2));

		if(attending.attendees[0].attendee.quantity) { 
			console.log('EB quantity detected, used for RSVP');
			event.rsvp = attending.attendees[0].attendee.quantity; // Eventbrite might not actually have this in their API
		} else {
			console.log('EB attendees length used instead of quantity for RSVP');
			event.rsvp = attending.attendees.length;
		}

		callback(null, event);
	});
}

getEvent = function(eventId, callback) {
	var event = {};

	eventbrite.event_get( {'id': eventId }, function(err, ebEventData){
		if (err) {
			return callback(err);
		}
		var ebEvent = ebEventData.event;
		event.id = eventId;
		event.venue = {	'name' : ebEvent.venue.name,
						'address' : ebEvent.venue.address,
						'lon' : ebEvent.venue.longitude,
						'lat' : ebEvent.venue.latitude
						};
		event.source = ebEvent.url;
		event.date = ebEvent.start_date;
		event.title = ebEvent.title;
		event.desc = ebEvent.long_description;
		event.arranger = ebEvent.organizer.name;
		getAttending(event, callback);
	});	
};

getEvents = function(eventIdList, callback) {
	if(eventIdList && eventIdList.length) {
		async.map(eventIdList, getEvent, callback);
	} else {
		callback(null, []);
	}
}

exports = module.exports = {
	'getEvent' : getEvent,
	'getEvents' : getEvents
};
