var config = require('./config'),
	Facebook = require('facebook-node-sdk'),
	async = require('async'),
	facebook = new Facebook({ appId: config.appId, secret: config.appSecret });
facebook.setAccessToken(config.userToken);

exports = module.exports = {
	'getEventInfo' : function (eventId, callback) {

		facebook.api('/' + eventId, function(err, event) {
			if (err) {
				console.log(err);
				callback(err);
			} else if (event.venue && event.venue.id) {
				event.venue = {id: event.venue.id};
				facebook.api('/' + event.venue.id, function(err, data) {
					event.venue.about = data.about;
					event.venue.attire = data.attire;
					event.venue.category = data.category;
					event.venue.hours = data.hours;
					event.venue.link = data.link;
					event.venue.location = data.location;
					event.venue.phone = data.phone;
					callback(null, event);
				});
			} else {
				callback(null, event);
			}
		});
	}
}

