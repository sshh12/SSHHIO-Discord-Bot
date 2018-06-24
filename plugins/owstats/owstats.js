const request = require('request');
const allUsers = require('../../users.json').users;

let options = {
  headers: {
    'User-Agent': 'SSHHIO Bot'
  },
  json: true
};

module.exports = function scoreboard(message) {

  let finished = 0; // keep track of requests sent

  let scoreboard = [];

  for(let user of allUsers) {

    if(!user.overwatch) {
      finished++;
      continue;
    }

    request('https://owapi.net/api/v3/u/' + user.overwatch.replace('#', '-') + '/stats', options, (err, res, body) => {

      if (err) {
        return;
      }

      if(body.hasOwnProperty('us')) {

        let comprank = body.us.stats.competitive.overall_stats.comprank;

        if(comprank != null) {
          scoreboard.push({
            "name": user.name,
            "score": comprank
          });
        }

      }

      finished++;

      if(finished == allUsers.length) { // Last request

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
