// Discord
const Discord = require('discord.js');
const client = new Discord.Client();

// Settings
const creds = require('./creds.json');
const settings = require('./settings.json');

// Plugins
const autoreact = require('./plugins/autoreact/autoreact');
const jokes = require('./plugins/jokes/jokes');
const catfact = require('./plugins/catfact/catfact');
const facts = require('./plugins/facts/facts');
const music = require('./plugins/music/music');
const pubgscores = require('./plugins/pubgstats/pubgstats');
const pubgscores2 = require('./plugins/pubgstats/pubgstats2');
const owscores = require('./plugins/owstats/owstats');

const MusicPlayer = new music(client);

client.on('ready', () => {
  console.log('Connected!');
});

client.on('message', message => {

  if (settings.channels.includes(message.channel.name)) {

    let msg = message.content;

    if (msg.startsWith('!')) {

      if (msg.startsWith('!joke')) {
        jokes(message);
      } else if (msg.startsWith('!catfact')) {
        catfact(message);
      } else if (msg.startsWith('!fact')) {
        facts(message);
      } else if (msg.startsWith('!play ')) {
        MusicPlayer.play(message);
      } else if (msg.startsWith('!stop')) {
        MusicPlayer.stop();
      } else if (msg.startsWith('!skip')) {
        MusicPlayer.skip();
      } else if (msg.startsWith('!pubgstats')) {
        msg.includes('2') ? pubgscores2(message) : pubgscores(message);
      } else if (msg.startsWith('!owstats')) {
        owscores(message);
      }

    } else {

      autoreact(client, message);

    }

  }

});

client.login(creds.token);
