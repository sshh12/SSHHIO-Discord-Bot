const Discord = require('discord.js');
const client = new Discord.Client();
const creds = require('./creds.json');
const settings = require('./settings.json');

const autoreact = require('./plugins/autoreact/autoreact');

client.on('ready', () => {
  console.log('Connected!');
});

client.on('message', message => {
  if (settings.channels.includes(message.channel.name)) {
    autoreact(client, message);
  }
});

client.login(creds.token);
