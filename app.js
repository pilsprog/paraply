
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , arranger = require('./routes/arranger')
  , event = require('./routes/event')
  , location = require('./routes/location')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 1337);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/arranger/*', routes.index);
app.get('/arranger', arranger.arrangerList);
app.get('/event/*', event.eventList);
app.get('/event', event.eventList);
app.get('/location/*', location.locationList);
app.get('/location', location.locationList);
app.get('/fb', routes.fbs);
app.get('/meetup/:eventIds', routes.meetup);
app.get('/events', routes.events);
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
