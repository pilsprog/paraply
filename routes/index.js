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
		if (cache && cache.length > 0) {
			res.render('index', {'events': cache});
		} else {
			updateCache(function (err, cache) {
				if (err) {
					res.writeHead(500, {'Content-Type': 'application/json'});
					res.end(JSON.stringify(err));
				} else {
					res.render('index', {'events': cache});
				}
			});
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
	if(req.params['type'] == 'eventid') {
		meetup.getEvents([req.params['value']], function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(data));
		});
	} else if(req.params['type'] == 'groupname') {
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

exports.addEventSource = function(req, res) {
	var eventURL = req.body.event;
	if (eventURL.match(/meetup.com\//)) {
		if(eventURL.match(/\/events\//)) {
			addEvent(req, res, new RegExp(/events\/([0-9a-zA-Z]+)/g), 'addMuEvent');
		} else {
			addGroup(req, res, new RegExp(/\/([0-9a-zA-Z\-]+)\/?$/g), 'addMuGroup');
		}
	} else if(eventURL.match(/facebook.com\//)) {
		addEvent(req, res, new RegExp(/events\/([0-9a-zA-Z]+)/g), 'addFbEvent');
	}
};

var addGroup = function(req, res, groupReg, func) {
	var eventURL = req.body.event,
		groupId = groupReg.exec(eventURL)[1];
		if (groupId) {
			db[func](groupId, function () {
				updateCache(function () {
					res.redirect('/');
				});
			});
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

var addEvent = function(req, res, eventReg, func) {
	var eventURL = req.body.event,
		eventId = eventReg.exec(eventURL)[1];

	if (eventId) {
		db[func](eventId, function (){
			updateCache(function() {
				res.redirect('/');
			});
		});
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
	db.getGroups(function (err, groups) {
		if (err) {
			callback(err);
		}
		meetup.addGroupsEvents(groups.mu, function () {
			db.getEvents(
				function (err, events) {
					async.parallel({
						'fb': function (cb) {
							fb.getEvents(events.fb, cb);
							},
						'mu': function (cb) {
							meetup.getMultipleEvents(events.mu, cb);
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
											callback(err);
										}
										callback(null, formatedEvents);
										db.setCache(formatedEvents, fireAndForget);
									}
								);

							}
					});
				}
			);
		});
	});
};

fireAndForget = function () {};
