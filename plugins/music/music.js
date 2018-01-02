
const ytdl = require("ytdl-core");

module.exports = class Music {

  constructor(client) {
    this.client = client;
    this.queue = [];
    this.voiceHandler = null;
    this.voiceChannel = null;
    this.voiceConnection = null;
    this.activated = false;
  }

  play(message) {

    if(!this.activated) {

      this._activate(message);

    } else {

      let url = message.content.replace('!play ' , '').trim();

      ytdl.getInfo(url, (error, info) => {
    		if(error) {
    			message.reply("Something went wrong...");
    		} else {
    			this.queue.push({title: info["title"], url: url, prompt: message});
    			message.reply('"' + info["title"] + '" added.');
          message.delete();
    			if(this.voiceHandler === null && this.queue.length === 1) {
    				this._stream_next_song();
    			}
    		}
    	});

    }

  }

  stop() {

    if(this.voiceHandler !== null) {
        this.queue = [];
				this.voiceHandler.end();
		}

    this.disconnect();

  }

  disconnect() {

    if(this.voiceChannel !== null) {
				this.voiceChannel.leave();
		}

    this.activated = false;

  }

  skip() {

    if(this.voiceHandler !== null) {
				this.voiceHandler.end();
		}

  }

  _activate(message) {

    let server = message.guild;
    this.voiceChannel = server.channels.find(chn => chn.type === "voice" && chn.members.exists("user", message.author));

    if(this.voiceChannel === null) {
      message.reply('Join a voice channel!');
      message.delete();
    } else {
      this.voiceChannel.join().then(connection => {
        this.voiceConnection = connection;
        this.activated = true;
        this.play(message);
      }).catch(console.error);
    }

  }

  _stream_next_song() {

    let nextSong = this.queue.shift();

    let options = {
      'quality': 'highest'
    }

    let audioStream = ytdl(nextSong.url, options);
	  this.voiceHandler = this.voiceConnection.playStream(audioStream);

    this.voiceHandler.once("end", reason => {
  		this.voiceHandler = null;
  		if(this.queue.length >= 1) {
  			this._stream_next_song();
  		} else {
        this.disconnect();
      }
  	});

  }

}
