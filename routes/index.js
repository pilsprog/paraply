var fb = require('../lib/fb');
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
