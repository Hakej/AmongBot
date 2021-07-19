require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment');
const config = require('./config.json');
const website = require('./website.js');
const { Pool } = require('pg');

const prefix = config.prefix;
const amongBotChannelID = config.amongBotChannelID;
const isLocalDeployement = process.env.USER == "hakej";

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.USER ? false : true
});

var dbclient;
var amongBotChannel;

async function main() {
    dbclient = await pool.connect();

    await loginBot();

    website.launch(bot, dbclient);

    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }

    setInterval(() => {
        var currentDate = new Date();

        if (process.env.USER != "hakej") {
            currentDate.setUTCHours(currentDate.getHours() + 1);
        }

        var currentHour = moment(currentDate).format('HH:mm');

        if (currentHour == '20:00') {
            amongBotChannel.send('Rozkład jazdy na dziś:');
            setTimeout(() => {
                amongBotChannel.send('Jazda z nimi!!');
            }, 1000);
        }
    }, 1000 * 60)
}

async function loginBot() {
    await setupEvents();
    await bot.login(process.env.TOKEN);

    amongBotChannel = await bot.channels.fetch(amongBotChannelID);

    console.log('AmongBot is online!');

    bot.user.setAvatar('./data/avatar.png')
        .then(console.log(`Avatar set!`))
        .catch(console.error);

    if (isLocalDeployement == true) {
        bot.user.setActivity('siedzę sobie lokalnie');
    }
    else {
        const randomMember = amongBotChannel.members.random();
        const wakeMsgs = ["Guess who's back.", "Dobra dobra już nie śpię.", "Wstałem.", "Już wiszę na hoście.",
            `${randomMember} pomógł mi wstać, dzięki byczq.`, "Powstałem jak feniks z popiołu. ", "Mniam, ładowareczka",
            "Wystraszyłem się, że zaspałem do szkoły, a przecież jestem botem. W sumie nie wiem jak się wystraszyłem w takim razie.", `Nie da się spać, bo ${randomMember} chrapie.`];
        const randomMsg = wakeMsgs[Math.floor(Math.random() * wakeMsgs.length)];

        amongBotChannel.send(randomMsg);

        bot.user.setActivity('wiszę na hoście');
    }
}

async function setupEvents() {
    bot.on('message', async (message) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLocaleLowerCase();

        try {
            await bot.commands.get(command).execute(message, args, dbclient, bot);
        } catch (error) {
            console.error(error);
            message.channel.send(`Nie ma takiej komendy byczq. (*${error.message})*`);
        }
    });

    bot.on("emojiCreate", async (emoji) => {
        const author = await emoji.fetchAuthor()
        amongBotChannel.send(`@here, ${author} dodał nową emotkę! ${emoji}`);
    });
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
})();
