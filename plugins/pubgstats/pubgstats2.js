const request = require('request');
const allUsers = require('../../users.json').users;

let options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
  }
};

module.exports = function scoreboard(message) {

  let finished = 0; // keep track of requests sent
  let season = '2018-06';

  let queueSizes = {
    'solo-fpp': 1,
    'duo-fpp': 2,
    'squad-fpp': 4
  }

  let scoreboard = {
    'solo-fpp': [],
    'duo-fpp': [],
    'squad-fpp': []
  };

  for(let user of allUsers) {

    if(!user.pubgopgg) {
      finished += 3;
      continue;
    }

    for(let gametype in queueSizes) {

      request(`https://pubg.op.gg/api/users/${user.pubgopgg}/ranked-stats?season=${season}&server=na&queue_size=${queueSizes[gametype]}&mode=fpp`, options, (err, res, body) => {

        if (err) {
          return;
        }

        let page = res.body;
        let playerData = JSON.parse(page);

        if(!playerData.stats) {
          finished++;
          return;
        }

        scoreboard[gametype].push({
          "name": user.name,
          "score": playerData.stats.rating
        });

        finished++;

        if(finished == allUsers.length * 3) { // Last request

          let fields = [];

          for(let gamemode in scoreboard) {

            scoreboard[gamemode].sort((a, b) => b.score - a.score);

            let text = "";
            for(let idx in scoreboard[gamemode]) {
              text += `\`${idx < 9 ? '0':''}${parseInt(idx) + 1}.\` **${scoreboard[gamemode][idx].score}** ${scoreboard[gamemode][idx].name}\n`;
            }
            text += "\n\n";

            fields.push({
              "name": gamemode.toUpperCase(),
              "value": text,
              "inline": true
            });

          }

          let embed = {
            "color": 15843115,
            "footer": {},
            "author": {
              "name": "PUBG Leaderboard"
            },
            "fields": fields
          };

          message.channel.send(".", { embed });

        }

      });

    }

  }

}
