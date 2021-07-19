module.exports = {
    name: 'blogoslaw',
    usage: 'blogoslaw',
    description: "przyzywa dobrego zwierzaczka",
    execute(message) {
        const fs = require('fs');
        const config = require('./../config.json');
        const blessDataPath = config.blessingDataPath;

        const blessDirectories = fs.readdirSync(blessDataPath);
        const blessDir = blessDirectories[Math.floor(Math.random() * blessDirectories.length)];

        const photos = fs.readdirSync(`${blessDataPath}${blessDir}`);
        const photo = photos[Math.floor(Math.random() * photos.length)];

        message.channel.send(`${message.author}, jestem dobrą istotą o imieniu **${blessDir}**, błogosławię twój dzień dobrocią.`, { files: [`${blessDataPath}${blessDir}/${photo}`] });
    }
}