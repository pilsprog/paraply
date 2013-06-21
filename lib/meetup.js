var meetup = require('meetup-api')(process.env.MU_KEY),
	db = require('./db'),
	async = require('async'),
	getEvent,
	getEvents,
	getMultipleEvents,
	getGroupEvents,
	makeEvent,
	fireAndForget = function () {};


makeEvent = function(jsonEvent, callback) {
	var event = {};
	event.id = jsonEvent.id;
	event.date = new Date(jsonEvent.time);
	if (event.date < new Date()) {
		db.oldMuEvent(event.id);
		return callback(null, {});
	}
	event.source = jsonEvent.event_url;
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
			return callback(err);
		}
		if (event && event.results && event.results.length) {
			makeEvent(event.results[0], callback);
		} else {
			callback(null, {});
		}
	});
};

exports.getEvents = function (eventIds, callback) {
	async.mapLimit(eventIds, 2, getEvent, function (err, list) {
		if (err) {
			callback(null, []);
		} else {
			async.filter(list,
				function (el, cb) {
					cb(el.id);
				},
				function (filteredList) {
					callback(null, filteredList);
				}
			);
		}

	});
};

exports.getMultipleEvents = function(eventIds, callback) {
	if(eventIds.length > 0) {
		meetup.getEvents({'event_id' : eventIds.join()}, function(err, events) {
			if(err) {
				console.log('Error for mu events: ' + eventIds);
				console.log(events);
				return callback(err);
			}
			if (events && events.results && events.results.length) {
				async.filter(events.results,
					function (el, cb) {
						cb(el.id);
					},
					function (filteredList) {
						async.map(filteredList, makeEvent, function (err, list) {
							if (err) {
								return callback(err);
							}
							callback(null, list);

						});
					}
				);
			} else {
				callback(null, {});
			}
		});
	} else {
		callback(null, []);
	}
};


getGroupEvents = function(groupname, callback) {
	if(groupname) {
		meetup.getEvents({'group_urlname' : groupname}, function(err, events) {
			if(err) {
				return callback(err);
			}
			async.map(events.results, makeEvent, function (err, list) {
				if (err) {
					return callback(err);
				}
				async.filter(list,
					function (el, cb) {
						if(el.date) {
							cb(new Date(el.date) > new Date());
						} else {
							cb(false);
						}
					},
					function (filteredList) {
						callback(null, filteredList);
					});
			});
		});
	} else {
		callback(null, []);
	}
};

exports.addGroupsEvents = function (groupIds, callback) {
	async.map(groupIds, getGroupEvents, function (err, groupsEvents) {
		if(err) {
			return callback(err);
		}
		async.each(groupsEvents,
				function (events, callback) {
					async.each(events,
								function(event, cb) {
									db.addMuEvents(event.id, cb);
								},
								function(err) {
									return callback(err, events);
								});
				},
				function (err) {
					return callback(err, groupsEvents);
				}
			);
	});
};
