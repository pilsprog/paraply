var fb = require('../lib/fb'),
	meetup = require('../lib/meetup');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.fb = function(req, res){
	fb.getEventInfo(req.params.event, function(err, data) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(data));
	});
};

exports.meetup = function(req, res) {
	meetup.getEvents(req.params.eventIds, function(err, data) {
		console.log("Write to response document");
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(data));
	});
};