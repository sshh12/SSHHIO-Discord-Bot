const request = require('request');
const allUsers = require('../../users.json').users;

let options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36'
  }
};

module.exports = function scoreboard(message) {

  let finished = 0; // keep track of requests sent

  let scoreboard = {
    'solo-fpp': [],
    'duo-fpp': [],
    'squad-fpp': []
  };

  for(let user of allUsers) {

    if(!user.pubg) {
      finished++;
      continue;
    }

    request('https://pubgtracker.com/profile/pc/' + user.pubg + '?region=na', options, (err, res, body) => {

      if (err) {
        return;
      }

      let page = res.body;
      let reData = RegExp('var playerData = ({[\\s\\S]+?});<\\/script>','g');
      let playerData = JSON.parse(reData.exec(page)[1]);
      let currentSeason = playerData.defaultSeason;

      for(let statGroup of playerData.Stats) {

        if(statGroup.Season == currentSeason && statGroup.Match in scoreboard && statGroup.Region == 'na') {

          for(let stat of statGroup.Stats) {

            if(stat.label == 'Rating') {
              scoreboard[statGroup.Match].push({
                "name": user.name,
                "score": stat.ValueDec,
                "percent": stat.percentile
              });
            }

          }

        }

      }

      finished++;

      if(finished == allUsers.length) { // Last request

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
