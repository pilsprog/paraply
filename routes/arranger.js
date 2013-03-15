
/*
 * GET home page.
 */

 exports.arrangerList = function(req, res){
  res.render('arrangerList', { title: 'Express' });
};

exports.arrangerSingle = function(req, res){
  res.render('arrangerSingle', { title: 'Express' });
};