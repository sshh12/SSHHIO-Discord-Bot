
const reacts = require('./autoreact.json');

module.exports = function autoreact(client, message) {

  if (reacts.enabled) {

    let msg = message.content
                     .toLowerCase()
                     .replace(/[^\w\s]|_/g, "")
                     .trim().split(" ");

    for (let word of msg) {
      for (let emoji in reacts.reacts) {
        if (reacts.reacts[emoji].includes(word)) {
          message.react(client.emojis.find("name", emoji));
        }
      }
    }

  }

}
