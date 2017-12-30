const Discord = require('discord.js');
const client = new Discord.Client();

const creds = require('./creds.json')

client.on('ready', () => {
  console.log('I am ready!');
});

client.login(creds.token);
