require('dotenv').config()

const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const prefix = config.prefix;
const amongBotChannelID = config.amongBotChannelID;

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
        if (command === 'help') {
            bot.commands.get(command).execute(message, bot.commands);
            return;
        }
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`Pojebało Cię? Nie ma takiej komendy byczq. (*${error.message})*`);
    }
});

bot.on("disconnect", function (event) {
    const channelPromise = bot.channels.fetch(amongBotChannelID);
    channelPromise.then((channel) => {
        channel.send('Idę spać, elo');
    })
});

// INTERVALS

const MIN_INTERVAL = 1000 * 60;

var loggedIn = bot.login(process.env.TOKEN);
loggedIn.then((message) => {
    console.log('AmongBot is online!');
    bot.user.setAvatar('./data/avatar.png')
        .then(user => console.log(`Avatar set!`))
        .catch(console.error);

    const channelPromise = bot.channels.fetch(amongBotChannelID);
    channelPromise.then((channel) => {
        if (process.env.USER == "hakej")
            bot.user.setActivity('siedzę sobie lokalnie');
        else
            bot.user.setActivity('wiszę na hoście');

        setInterval(function () {
            var currentDate = new Date();
            if (process.env.USER != "hakej") {
                currentDate.setUTCHours(currentDate.getHours() + 1);
            }

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
