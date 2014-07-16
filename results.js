var http = require('http'),
	fs = require('fs');

var jsdom = require('jsdom');

http.createServer(function(req, res){

	 res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  jsdom.env(
    "http://www.premierleague.com/en-gb/matchday/results.html?paramComp_100=true&paramSeason=2013-2014&view=.dateSeason",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {

			var results = [];

      window.$("table.contentTable").each(function(i) {

      	var strDate = window.$(this).find("th").text();

      	window.$(this).children("tr").each(function(j){

          if (window.$(this).find("th").text().length > 0)
            return;

      		if (window.$(this).find("td.rHome")){

            var date = new Date(strDate + " " + window.$(this).children("td.time").text() );
            var score = window.$.trim(window.$(this).find("td.score").text());
      			var homeTeam = window.$.trim(window.$(this).find("td.rHome").text());
      			var awayTeam = window.$.trim(window.$(this).find("td.rAway").text());
            var homeScore = score.split(' - ')[0];
            var awayScore = score.split(' - ')[1];
      			var venue = window.$.trim(window.$(this).find("td.location").text());

						if (venue)
							results.push({ date: date, score: score, homeTeam:homeTeam, awayTeam:awayTeam, homeScore: homeScore, awayScore: awayScore, venue: venue});

      		}

      	});
      });

			res.write(JSON.stringify(results));
      res.end();
    }
  );

}).listen(30000);
