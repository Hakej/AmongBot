const Discord = require('discord.js');
const fs = require('fs');

const prefix = '-';
const amongChannelID = '766674080224772156';

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    try {
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send('Pojebało Cię? Nie ma takiej komendy byczq.');
    }
});

bot.on("disconnect", function (event) {
    const channelPromise = bot.channels.fetch(amongChannelID);
    channelPromise.then((channel) => {
        channel.send('Idę spać, elo');
    })
});

// INTERVALS

const MIN_INTERVAL = 1000 * 60;

var loggedIn = bot.login('NzY0MDgwMTI1MzgxNzA1NzI4.X4BDEQ.j4Ju_nMnnX270_pr8lMObRKIcZM');
loggedIn.then((message) => {
    console.log('AmongBot is online!');

    const channelPromise = bot.channels.fetch(amongChannelID);
    channelPromise.then((channel) => {
        var currentDate = new Date();
        if (process.env.USER == "hakej") {
            channel.send('Hakej coś świruje ze mną na lokalnym środowisku, nie zdziwijcie się jak nie będę działać. <:hakej:763828679817560107>');
            bot.user.setActivity('siedzę sobie lokalnie');
        } else {
            currentDate.setUTCHours(currentDate.getHours() + 2);
            bot.user.setActivity('jestem na hoście');
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