const request = require('request');
const owusers = require('./users.json');

let options = {
  headers: {
    'User-Agent': 'SSHHIO Bot'
  },
  json: true
};

module.exports = function scoreboard(message) {

  let users = owusers.users;

  let finished = 0; // keep track of requests sent

  let scoreboard = [];

  for(let user of users) {

    request('https://owapi.net/api/v3/u/' + user.replace('#', '-') + '/stats', options, (err, res, body) => {

      if (err) {
        return;
      }

      if(body.hasOwnProperty('us')) {

        let comprank = body.us.stats.competitive.overall_stats.comprank;

        if(comprank != null) {
          scoreboard.push({
            "name": user.split('#')[0],
            "score": comprank
          });
        }

      }

      finished++;

      if(finished == users.length) { // Last request

        let fields = [];

        scoreboard.sort((a, b) => b.score - a.score);

        let text = "";
        for(let idx in scoreboard) {
          text += `\`${parseInt(idx) + 1}.\` **${scoreboard[idx].score}** ${scoreboard[idx].name}\n`;
        }
        text += "\n\n";

        fields.push({
          "name": 'Competitive',
          "value": text,
          "inline": true
        });

        let embed = {
          "color": 15843115,
          "footer": {},
          "author": {
            "name": "OW Leaderboard"
          },
          "fields": fields
        };

        message.channel.send(".", { embed });

      }

    });

  }

}
