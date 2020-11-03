require('dotenv').config()

const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const website = require('./website.js');
const { Pool } = require('pg');

const prefix = config.prefix;
const amongBotChannelID = config.amongBotChannelID;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.USER ? false : true
});

const dbclient = pool.connect()

website.launch(bot, dbclient);

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
        bot.commands.get(command).execute(message, args, dbclient, bot);
    } catch (error) {
        console.error(error);
        message.channel.send(`Pojebało Cię? Nie ma takiej komendy byczq. (*${error.message})*`);
    }
});

bot.on("emojiCreate", function (emoji) {
    bot.channels.fetch(amongBotChannelID)
        .then((channel) => {
            emoji.fetchAuthor()
                .then((author) => {
                    console.log(`${author.name} added a new emoji: ${emoji.name}.`);
                    channel.send(`@here, ${author} dodał nową emotkę! ${emoji}`);
                })
        });
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
        if (process.env.USER == "hakej") {
            bot.user.setActivity('siedzę sobie lokalnie');
        }
        else {
            const randomMember = channel.members.random();
            const wakeMsgs = ["Guess who's back, bitches.", "Dobra dobra już nie śpię.", "Wstałem i się zesrałem.", "Już wiszę na hoście, szkoda, że nie na drzewie.",
                `${randomMember} pomógł mi wstać, dzięki byczq.`, "Powstałem jak feniks z popiołu. Albo chuj rano, nie wiem.", "Mniam, ładowareczka",
                "Obsrałem się, że zaspałem do szkoły, a przecież jestem botem. W sumie nie wiem jak się obsrałem w takim razie.", `Nie da się spać, bo ${randomMember} chrapie.`];
            const randomMsg = wakeMsgs[Math.floor(Math.random() * wakeMsgs.length)];
            channel.send(randomMsg);

            bot.user.setActivity('wiszę na hoście');
        }

        setInterval(function () {
            var currentDate = new Date();
            if (process.env.USER != "hakej") {
                currentDate.setUTCHours(currentDate.getHours() + 1);
            }
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
