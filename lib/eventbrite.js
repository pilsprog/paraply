var config = require('./config'),
	Eventbrite = require('eventbrite'),
	async = require('async'),
	eventbrite = Eventbrite({'app_key': config.eventbrite_key}),
	getEvent,
	getEvents,
	getAttending;

// TODO get this to work properly
getAttending = function (event, callback) {
	eventbrite.event_list_attendees( {'id': event.id }, function(err, attending){
		if (err) {
			return callback(err);
		}
		if(attending.quantity) {
			event.rsvp = attending.quantity;
		} else {
			event.rsvp = null;
		}
		callback(null, event);
	});
}

// TODO find some way of getting event ids from something people actually know how to find 6783207757, 6645885021
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
		callback(null, event);
	});	
};

getEvents = function(eventIdList, callback) {
	async.map(eventIdList, getEvent, callback);
}

exports = module.exports = {
	'getEvent' : getEvent,
	'getEvents' : getEvents
};
