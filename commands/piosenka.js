const { description, execute } = require("./ranking")

module.exports = {
    name: 'piosenka',
    usage: 'piosenka',
    description: 'wylosuj piosenkę na teraz z mojej playlisty',
    execute(message) {
        const ytlist = require('youtube-playlist');

        var playListURL = process.env.PLAYLIST_URL;

        ytlist(playListURL, 'url').then(res => {
            const playlist = res.data.playlist;
            const randomVideo = playlist[Math.floor(Math.random() * playlist.length)];
            message.channel.send(`${message.author}, twoja piosenka na teraz to ${randomVideo}`);
        });
    }
}