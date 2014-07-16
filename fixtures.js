var http = require('http');
var jsdom = require('jsdom');

http.createServer(function(req, res){

  var matchDays = new Array();
  var matches = new Array();

	 res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  jsdom.env(
    "http://www.premierleague.com/en-gb/matchday/matches.html?paramClubId=ALL&paramComp_100=true&view=.dateSeason",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {

      window.$("table.contentTable").each(function(i) {

      	var strDate = window.$(this).find("th").text().trim();
        var d = new Date(strDate);
        matchDays.push(d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear());

        window.$(this).children("tr").each(function(j) {

          var kickOff = new Date(strDate + " " + window.$(this).children("td.time").text().trim());

          var clubs = window.$(this).children("td.clubs").text().trim().split(' v ');

          var location = window.$(this).children("td.location").text().trim();

          console.log(kickOff);
          console.log(clubs[0]);
          console.log(clubs[1]);
          console.log(location);

          if (location)
            matches.push({venue: location, home: clubs[0], away: clubs[1], time: kickOff});

        });

      });

      var result = {matchDays: matchDays, fixtures: matches};

      res.write(JSON.stringify(result));
      res.end();
    }
  );

}).listen(30000);
