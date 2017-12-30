
// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const creds = require('./creds.json');
const settings = require('./settings.json');

// Plugins
const autoreact = require('./plugins/autoreact/autoreact');
const jokes = require('./plugins/jokes/jokes');

client.on('ready', () => {
  console.log('Connected!');
});

client.on('message', message => {
  if (settings.channels.includes(message.channel.name)) {

    if(message.content.startsWith('!')) {

      if(message.content === '!joke') {
        jokes(message);
      }

    } else {

      autoreact(client, message);

    }

  }
});

client.login(creds.token);
