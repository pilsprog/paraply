var	db = require('../lib/db'),
	async = require('async'),
	fb = require('../lib/fb'),
	meetup = require('../lib/meetup'),
	moment = require('moment'),
	updateCache,
	index,
	fireAndForget;
moment.lang('nb');
/*
 * GET home page.
 */
exports.index = function(req, res){
	db.getCache(function (err, cache) {
		if (false) {
			res.render('index', {'events': cache});
		} else {
			db.getEvents(
				function (err, events) {
					async.parallel({
						'fb': function (callback) {
							fb.getEvents(events.fb, callback);
							},
						'mu': function (callback) {
							meetup.getEvents(events.mu, callback)
							}
						}, function (err, data) {
							var events = data.fb.concat(data.mu);
							if (err) {
								res.writeHead(500, {'Content-Type': 'application/json'});
								res.end(JSON.stringify(err));
							} else {
								async.map(events,
									function (event, cb) {
										event.date = moment(event.date).fromNow();
										cb(null, event);
									},
									function (err, formatedEvents) {
										if (err) {
											res.writeHead(500, {'Content-Type': 'application/json'});
											res.end(JSON.stringify(err));
										}
										res.render('index', {'events': formatedEvents});
										db.setCache(formatedEvents, fireAndForget);
									}
								);

							}
					});
				}
			)
		}
	});
};

exports.fb = function (req, res) {
	fb.getEvent(req.params.event, function(err, data) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		if (err) {
			res.end(JSON.stringify(data));
		}
		res.end(JSON.stringify(data));
	});
};

exports.fbs = function (req, res) {
	db.getEvents(function (err, events) {
		fb.getEvents(events.fb, function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			if (err) {
				res.end(JSON.stringify(data));
			}
			res.end(JSON.stringify(data));
		});
	});
};

exports.meetup = function(req, res) {
	console.log(req.params);
	if(req.params['type'] == 'eventid') {
		meetup.getEvents([req.params['value']], function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(data));
		});
	} else if(req.params['type'] == 'groupname') {
		console.log("Get events from group name: " + JSON.stringify(req.params));
		meetup.getGroupEvents([req.params['value']], function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(data));
		});
	}
};

exports.events = function(req, res) {
	db.getEvents(function (err, events) {
		async.parallel({
			'fb': function (callback) {
				fb.getEvents(events.fb, callback);
			},
			'mu': function (callback) {
				meetup.getEvents(events.mu, callback);
			}
		}, function (err, data) {
			if (err) {
				res.writeHead(500, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(data));
			} else {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(data.fb.concat(data.mu)));
			}
		});
	});
};

exports.addEvent = function(req, res) {
	var eventURL = req.body.event,
		eventReg = new RegExp(/events\/([0-9]+)/g),
		eventId,
		func;
	if (eventURL.match(/meetup.com\//)) {
		func = 'addMuEvent';
		eventId = eventReg.exec(eventURL)[1];
	} else if (eventURL.match(/facebook.com\//)) {
		func = 'addFbEvent';
		eventId = eventReg.exec(eventURL)[1];
	}

	if (eventId) {
		db[func](eventId, function (){
			updateCache(function() {
				res.redirect('/');
			});
		})
	} else {
		res.writeHead(500, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(
		{
			'uri': req.params.event,
			'error': 'No method of storing event'
		}
		));
	}

};

updateCache = function (callback) {
	db.getEvents(function (err, events) {
		async.parallel({
			'fb': function (callback) {
				fb.getEvents(events.fb, callback);
			},
			'mu': function (callback) {
				meetup.getEvents(events.mu, callback);
			}
		}, function (err, data) {
			if (err) {
				return callback(err);
			} else {
				db.setCache(data.fb.concat(data.mu));
				callback(null, 'done');

			}
		});
	});
}

fireAndForget = function () {};
