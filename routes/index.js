var	db = require('../lib/db'),
	async = require('async'),
	fb = require('../lib/fb'),
	meetup = require('../lib/meetup');
/*
 * GET home page.
 */

exports.index = function(req, res){
	var mockdata = [{"id":"119485382","source":"http://www.meetup.com/Laer-kidsene-koding-Bergen/events/119485382/","date":"2013-06-08T10:00:00.000Z","venue":{"name":"Bergen Offentlige Bibliotek","address":"StrÃ¸mgaten 6","lon":5.331672,"lat":60.389881},"arranger":"LÃ¦r kidsene koding! Bergen","title":"Aktivitetsdag - barn og voksne koder, sammen!","desc":"<p><strong><span>Vil du lÃ¦re Ã¥ programmere spill, datamaskiner og roboter?</span></strong></p>\n<p><a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\"><span>LÃ¦r kidsene koding - Bergen</span></a> <span>arrangerer aktivitetsdag for at barn og voksne skal fÃ¥ mulighet til Ã¥ bli bedre kjent med program- og maskinvare for programmering og kreativ problemlÃ¸ysing.</span></p>\n<p><span>MÃ¥let med dagen er at barn med foreldre i alle aldre skal ha det moro med teknologi og plukke opp ting dei kan fortsetje med heime eller ta videre i vennegjengen, pÃ¥ skulen eller andre arenaer. Det blir smaksprÃ¸ver, mulighet til Ã¥ teste ut, og korte presentasjoner av programmeringsverktÃ¸y og maskinvare som til dÃ¸mes:</span></p>\n<p><strong><a href=\"http://scratch.mit.edu/\">Scratch</a></strong> <span>- <em>grafisk programmeringssprÃ¥k som gjÃ¸r det lett Ã¥ lage interaktive historier, spill, musikk og animasjoner</em></span></p>\n<p><strong><a href=\"http://www.arduino.cc/\">Arduino</a></strong> <span>- <em>plattform for prototyping av elektronikk basert pÃ¥ program- og maskinvare</em></span></p>\n<p><strong><a href=\"http://mindstorms.lego.com/en-us/default.aspx\">NXT Lego Mindstorm</a></strong> <span>- <em>programmerbare Lego-roboter</em></span></p>\n<p><strong><a href=\"http://www.raspberrypi.org/\">Raspberry Pi</a></strong> <span>- <em>en knÃ¸ttliten datamaskin utviklet med tanke pÃ¥ Ã¥ lÃ¦re grunnleggende databehandling</em></span></p>\n<p><strong><a href=\"http://www.yoyogames.com/gamemaker/studio\">Gamemaker</a></strong> <span>- <em>program for Ã¥ utvikle dataspill pÃ¥ en enkel mÃ¥te</em></span></p>\n<p><strong><a href=\"https://minecraft.net/\">Minecraft</a></strong> <span>- Â <em>spill for Ã¥ bygge konstruksjoner av kuber i en 3D-verden</em></span></p>\n<p><strong><a href=\"http://movetheturtle.com/\">Move the Turtle</a></strong> <span>og</span> <strong><a href=\"http://www.gethopscotch.com/\">Hopscotch</a></strong> <span>- <em>enkle spilllignende apper pÃ¥ iOS for Ã¥ lÃ¦re de minste grunnleggende programmering</em></span></p>\n<p><span>Ta gjerne med ting du vil vise frem sjÃ¸lv eller som du har lyst til Ã¥ lÃ¦re meir om. Barn og unge av begge kjÃ¸nn oppmuntres til Ã¥ vise fram det dei er interessert i eller som dei er i ferd med Ã¥ lÃ¦re seg.</span></p>\n<p><span>Bergen Off. Bibliotek ved prosjektet</span> <a href=\"http://bergenbibliotek.no/spill/digital-arena\"><span>Digital arena</span></a> <span>spanderer frukt og pizza pÃ¥ deltakarane.</span></p>\n<p><span><span>Det er ogsÃ¥ eit mÃ¥l Ã¥ byggje</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\">LÃ¦r kidsene koding</a><span>-nettverket stÃ¸rre og prate uformelt om videre utvikling av \"LÃ¦r kidsene koding\" i Bergen.</span> Dersom du har konkrete ting du ynskjer Ã¥ bidra med eller er nysgjerrige pÃ¥ kan du kontakte</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/members/?op=leaders\"><span>arrangÃ¸rane</span></a><span>.</span></p>\n<p><span><em>Ta med egen laptop eller nettbrett om du har.</em> <br />\n\n</span></p>"},{"id":"119485382","source":"http://www.meetup.com/Laer-kidsene-koding-Bergen/events/119485382/","date":"2013-06-08T10:00:00.000Z","venue":{"name":"Bergen Offentlige Bibliotek","address":"StrÃ¸mgaten 6","lon":5.331672,"lat":60.389881},"arranger":"LÃ¦r kidsene koding! Bergen","title":"Aktivitetsdag - barn og voksne koder, sammen!","desc":"<p><strong><span>Vil du lÃ¦re Ã¥ programmere spill, datamaskiner og roboter?</span></strong></p>\n<p><a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\"><span>LÃ¦r kidsene koding - Bergen</span></a> <span>arrangerer aktivitetsdag for at barn og voksne skal fÃ¥ mulighet til Ã¥ bli bedre kjent med program- og maskinvare for programmering og kreativ problemlÃ¸ysing.</span></p>\n<p><span>MÃ¥let med dagen er at barn med foreldre i alle aldre skal ha det moro med teknologi og plukke opp ting dei kan fortsetje med heime eller ta videre i vennegjengen, pÃ¥ skulen eller andre arenaer. Det blir smaksprÃ¸ver, mulighet til Ã¥ teste ut, og korte presentasjoner av programmeringsverktÃ¸y og maskinvare som til dÃ¸mes:</span></p>\n<p><strong><a href=\"http://scratch.mit.edu/\">Scratch</a></strong> <span>- <em>grafisk programmeringssprÃ¥k som gjÃ¸r det lett Ã¥ lage interaktive historier, spill, musikk og animasjoner</em></span></p>\n<p><strong><a href=\"http://www.arduino.cc/\">Arduino</a></strong> <span>- <em>plattform for prototyping av elektronikk basert pÃ¥ program- og maskinvare</em></span></p>\n<p><strong><a href=\"http://mindstorms.lego.com/en-us/default.aspx\">NXT Lego Mindstorm</a></strong> <span>- <em>programmerbare Lego-roboter</em></span></p>\n<p><strong><a href=\"http://www.raspberrypi.org/\">Raspberry Pi</a></strong> <span>- <em>en knÃ¸ttliten datamaskin utviklet med tanke pÃ¥ Ã¥ lÃ¦re grunnleggende databehandling</em></span></p>\n<p><strong><a href=\"http://www.yoyogames.com/gamemaker/studio\">Gamemaker</a></strong> <span>- <em>program for Ã¥ utvikle dataspill pÃ¥ en enkel mÃ¥te</em></span></p>\n<p><strong><a href=\"https://minecraft.net/\">Minecraft</a></strong> <span>- Â <em>spill for Ã¥ bygge konstruksjoner av kuber i en 3D-verden</em></span></p>\n<p><strong><a href=\"http://movetheturtle.com/\">Move the Turtle</a></strong> <span>og</span> <strong><a href=\"http://www.gethopscotch.com/\">Hopscotch</a></strong> <span>- <em>enkle spilllignende apper pÃ¥ iOS for Ã¥ lÃ¦re de minste grunnleggende programmering</em></span></p>\n<p><span>Ta gjerne med ting du vil vise frem sjÃ¸lv eller som du har lyst til Ã¥ lÃ¦re meir om. Barn og unge av begge kjÃ¸nn oppmuntres til Ã¥ vise fram det dei er interessert i eller som dei er i ferd med Ã¥ lÃ¦re seg.</span></p>\n<p><span>Bergen Off. Bibliotek ved prosjektet</span> <a href=\"http://bergenbibliotek.no/spill/digital-arena\"><span>Digital arena</span></a> <span>spanderer frukt og pizza pÃ¥ deltakarane.</span></p>\n<p><span><span>Det er ogsÃ¥ eit mÃ¥l Ã¥ byggje</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\">LÃ¦r kidsene koding</a><span>-nettverket stÃ¸rre og prate uformelt om videre utvikling av \"LÃ¦r kidsene koding\" i Bergen.</span> Dersom du har konkrete ting du ynskjer Ã¥ bidra med eller er nysgjerrige pÃ¥ kan du kontakte</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/members/?op=leaders\"><span>arrangÃ¸rane</span></a><span>.</span></p>\n<p><span><em>Ta med egen laptop eller nettbrett om du har.</em> <br />\n\n</span></p>"},{"id":"119485382","source":"http://www.meetup.com/Laer-kidsene-koding-Bergen/events/119485382/","date":"a2013-06-08T10:00:00.000Z","venue":{"name":"Bergen Offentlige Bibliotek","address":"aStrømgaten 6","lon":5.331672,"lat":60.389881},"arranger":"LÃ¦r kidsene koding! Bergen","title":"Aktivitetsdag - barn og voksne koder, sammen!","desc":"<p><strong><span>Vil du lÃ¦re Ã¥ programmere spill, datamaskiner og roboter?</span></strong></p>\n<p><a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\"><span>LÃ¦r kidsene koding - Bergen</span></a> <span>arrangerer aktivitetsdag for at barn og voksne skal fÃ¥ mulighet til Ã¥ bli bedre kjent med program- og maskinvare for programmering og kreativ problemlÃ¸ysing.</span></p>\n<p><span>MÃ¥let med dagen er at barn med foreldre i alle aldre skal ha det moro med teknologi og plukke opp ting dei kan fortsetje med heime eller ta videre i vennegjengen, pÃ¥ skulen eller andre arenaer. Det blir smaksprÃ¸ver, mulighet til Ã¥ teste ut, og korte presentasjoner av programmeringsverktÃ¸y og maskinvare som til dÃ¸mes:</span></p>\n<p><strong><a href=\"http://scratch.mit.edu/\">Scratch</a></strong> <span>- <em>grafisk programmeringssprÃ¥k som gjÃ¸r det lett Ã¥ lage interaktive historier, spill, musikk og animasjoner</em></span></p>\n<p><strong><a href=\"http://www.arduino.cc/\">Arduino</a></strong> <span>- <em>plattform for prototyping av elektronikk basert pÃ¥ program- og maskinvare</em></span></p>\n<p><strong><a href=\"http://mindstorms.lego.com/en-us/default.aspx\">NXT Lego Mindstorm</a></strong> <span>- <em>programmerbare Lego-roboter</em></span></p>\n<p><strong><a href=\"http://www.raspberrypi.org/\">Raspberry Pi</a></strong> <span>- <em>en knÃ¸ttliten datamaskin utviklet med tanke pÃ¥ Ã¥ lÃ¦re grunnleggende databehandling</em></span></p>\n<p><strong><a href=\"http://www.yoyogames.com/gamemaker/studio\">Gamemaker</a></strong> <span>- <em>program for Ã¥ utvikle dataspill pÃ¥ en enkel mÃ¥te</em></span></p>\n<p><strong><a href=\"https://minecraft.net/\">Minecraft</a></strong> <span>- Â <em>spill for Ã¥ bygge konstruksjoner av kuber i en 3D-verden</em></span></p>\n<p><strong><a href=\"http://movetheturtle.com/\">Move the Turtle</a></strong> <span>og</span> <strong><a href=\"http://www.gethopscotch.com/\">Hopscotch</a></strong> <span>- <em>enkle spilllignende apper pÃ¥ iOS for Ã¥ lÃ¦re de minste grunnleggende programmering</em></span></p>\n<p><span>Ta gjerne med ting du vil vise frem sjÃ¸lv eller som du har lyst til Ã¥ lÃ¦re meir om. Barn og unge av begge kjÃ¸nn oppmuntres til Ã¥ vise fram det dei er interessert i eller som dei er i ferd med Ã¥ lÃ¦re seg.</span></p>\n<p><span>Bergen Off. Bibliotek ved prosjektet</span> <a href=\"http://bergenbibliotek.no/spill/digital-arena\"><span>Digital arena</span></a> <span>spanderer frukt og pizza pÃ¥ deltakarane.</span></p>\n<p><span><span>Det er ogsÃ¥ eit mÃ¥l Ã¥ byggje</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/\">LÃ¦r kidsene koding</a><span>-nettverket stÃ¸rre og prate uformelt om videre utvikling av \"LÃ¦r kidsene koding\" i Bergen.</span> Dersom du har konkrete ting du ynskjer Ã¥ bidra med eller er nysgjerrige pÃ¥ kan du kontakte</span> <a href=\"http://www.meetup.com/Laer-kidsene-koding-Bergen/members/?op=leaders\"><span>arrangÃ¸rane</span></a><span>.</span></p>\n<p><span><em>Ta med egen laptop eller nettbrett om du har.</em> <br />\n\n</span></p>"}];
  res.render('index', {'events': mockdata});
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
	if(req.params['type'] == 'eventids') {
		meetup.getEvents(req.params['values'], function(err, data) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(data));
		});
	} else if(req.params['type'] == 'groupname') {
		console.log("Get events from group name: " + JSON.stringify(req.params));
		meetup.getGroupEvents(req.params['values'], function(err, data) {
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
