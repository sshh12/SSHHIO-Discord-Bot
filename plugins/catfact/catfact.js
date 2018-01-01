
const request = require('request');

let options = {
  headers: {'User-Agent': 'SSHHIO Bot' },
  json: true
};

module.exports = function joke(message) {
  request('https://catfact.ninja/fact', options, (err, res, body) => {
    if (err) { return; }
    message.channel.send(body.fact);
  });
}
