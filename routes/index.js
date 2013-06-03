var	db = require('../lib/db'),
	async = require('async'),
	fb = require('../lib/fb'),
	meetup = require('../lib/meetup');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
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
	meetup.getEvents(req.params.eventIds, function(err, data) {
		console.log("Write to response document");
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(data));
	});
};

exports.events = function(req, res) {
	db.getEvents(function (err, events) {
		async.parallel({
			'fb': function (callback) {
				fb.getEvents(events.fb, callback);
			},
			'mu': function (callback) {
				meetup.getEvents(events.mu, callback)
			}
		}, function (err, data) {
			if (err) {
				console.log(err);
				res.writeHead(500, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(data));
			} else {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(data.fb.concat(data.mu)));
			}
		});
	});
};
