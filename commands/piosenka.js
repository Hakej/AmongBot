const scrapePlaylist = require("youtube-playlist-scraper");
const config = require('./../config.json');

module.exports = {
    name: 'piosenka',
    usage: 'piosenka',
    description: 'wylosuj piosenkę na teraz z mojej playlisty',
    execute(message) {
        var playlistID = config.amongBotPlaylistID;
        scrapePlaylist(playlistID).then((data) => {
            const play = data;
            const playlist = data.playlist;
            const randomVideo = playlist[Math.floor(Math.random() * playlist.length)];
            message.channel.send(`${message.author}, twoja piosenka na teraz to ${randomVideo.url}`);
        });
    }
}