const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === 'ping') {
        client.commands.get('ping').execute(message, args);
    } else if (command === 'ktokurwi') {
        client.commands.get('ktokurwi').execute(message, args);
    } else if (command === 'orientacja') {
        client.commands.get('sexuality').execute(message, args);
    } else if (command === 'rand') {
        client.commands.get('rand').execute(message, args);
    }
});

const MIN_INTERVAL = 1000 * 60;

var loggedIn = client.login('NzY0MDgwMTI1MzgxNzA1NzI4.X4BDEQ.JDTxFPTSZ71nWyi0OIatFXjOBkM');

loggedIn.then((message) => {
    console.log('AmongBot is online!');

    const channelPromise = client.channels.fetch('763818521288245329');
    channelPromise.then((channel) => {
        setInterval(function () {
            var currentDate = new Date();
            if (currentDate.getMinutes() == 00 && currentDate.getHours() == 20) {
                channel.send('Rozkład jazdy na dziś:');

                setTimeout(function () {
                    channel.send('Jazda z kurwami!!');
                    channel.send('@here');
                }, 5000);
            }
        }, MIN_INTERVAL)
    });
})
