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

const MusicPlayer = new music(client);

client.on('ready', () => {
  console.log('Connected!');
});

client.on('message', message => {

  if (settings.channels.includes(message.channel.name)) {

    if (message.content.startsWith('!')) {

      if (message.content.startsWith('!joke')) {
        jokes(message);
      } else if (message.content.startsWith('!catfact')) {
        catfact(message);
      } else if (message.content.startsWith('!fact')) {
        facts(message);
      } else if (message.content.startsWith('!play ')) {
        MusicPlayer.play(message);
      } else if (message.content.startsWith('!stop')) {
        MusicPlayer.stop();
      } else if (message.content.startsWith('!skip')) {
        MusicPlayer.skip();
      }

    } else {

      autoreact(client, message);

    }

  }

});

client.login(creds.token);
