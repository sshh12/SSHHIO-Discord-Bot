
const request = require('request');

let options = {
  headers: {'User-Agent': 'SSHHIO Bot' },
  json: true
};

module.exports = function fact(message) {
  request('http://numbersapi.com/random/trivia?json', options, (err, res, body) => {
    if (err) { return; }
    message.channel.send(body.text);
  });
}
