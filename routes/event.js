
/*
 * GET home page.
 */

exports.eventList = function(req, res){
  res.render('eventList', { title: 'Express' });
};

exports.eventSingle = function(req, res){
  res.render('eventSingle', { title: 'Express' });
};

exports.eventAdd = function(req, res){
  res.render('eventAdd', { title: 'Express' });
};