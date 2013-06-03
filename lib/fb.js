var config = require('./config'),
	Facebook = require('facebook-node-sdk'),
	async = require('async'),
	facebook = new Facebook({ appId: config.appId, secret: config.appSecret }),
	getEventInfo;
facebook.setAccessToken(config.userToken);


exports = module.exports = {
	'getEventInfo' : getEventInfo
}

getEventInfo = function (eventId, callback) {
	var event = {};
	facebook.api('/' + eventId, function(err, fbEvent) {
		if (err) {
			console.log(err);
			callback(err);
		}
		event.source = 'https://www.facebook.com/events/' + eventId;
		event.date = fbEvent.start_date;
		event.title = fbEvent.name;
		event.desc = fbEvent.description;
		if (event.owner) {
			event.arranger = event.owener.name
		}

		if (fbEvent.venue && fbEvent.venue.id) {
			facebook.api('/' + eventId + '/attending', function (err, attending) {
				if (err) {
					callback(err);
				}
				event.rsvp = attending.data;
				facebook.api('/' + fbEvent.venue.id, function(err, data) {
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
			});
		} else {
			callback(null, event);
		}
	});
}



