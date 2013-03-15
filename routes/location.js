
/*
 * GET home page.
 */

exports.locationList = function(req, res){
  res.render('locationList', { title: 'Express' });
};
exports.locationSingle = function(req, res){
  res.render('locationSingle', { title: 'Express' });
};