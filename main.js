const Discord = require('discord.js');
const fs = require('fs');

const prefix = '-';
const amongChannelID = '766674080224772156';

const client = new Discord.Client();
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

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('Pojebało Cię? Nie ma takiej komendy byczq.');
    }
});

const MIN_INTERVAL = 1000 * 60;

var loggedIn = client.login('NzY0MDgwMTI1MzgxNzA1NzI4.X4BDEQ.j4Ju_nMnnX270_pr8lMObRKIcZM');

loggedIn.then((message) => {
    console.log('AmongBot is online!');

    const channelPromise = client.channels.fetch(amongChannelID);
    channelPromise.then((channel) => {
        var currentDate = new Date();
        if (process.env.USER == "hakej") {
            channel.send('Hakej coś świruje ze mną na lokalnym środowisku, nie zdziwijcie się jak nie będę działać. <:hakej:763828679817560107>');
        } else {
            currentDate.setUTCHours(currentDate.getHours() + 2);
        }

        setInterval(function () {
            console.log(currentDate.toString());
            if (currentDate.getHours() == 20 && currentDate.getMinutes() == 00) {
                channel.send('Rozkład jazdy na dziś:');
                setTimeout(function () {
                    channel.send('Jazda z kurwami!!');
                    channel.send('@here');
                }, 1000);
            } else if (currentDate.getHours() == 21 && currentDate.getMinutes() == 37) {
                channel.send('[**21:37**]');
                channel.send('Dobry wieczór. Papieżowa.');
                channel.send('@here');
            }
        }, MIN_INTERVAL)
    });
})