const Map = require("collections/map");
const fs = require("fs");
const config = require('./../config.json');

const farmChannelID = config.farmChannelID;
const commands = new Map();

module.exports = {
    name: 'farma',
    usage: 'farma',
    description: "pobaw się na swojej farmie",
    execute: async (message, args, dbclient, bot) => {
        if (message.channel.id != farmChannelID) {
            var farmChannel = await bot.channels.fetch(farmChannelID);
            message.channel.send(`${message.author}, zmykaj na ${farmChannel} farmerze.`);
            return;
        }

        if (args[0] == null) {
            message.channel.send(`${message.author}, brakuje podkomendy kolego. (sprawdź ** -farma help**)`);
            return;
        }

        const owner = message.author;
        const command = args.shift().toLowerCase();
        const mentionedUser = message.mentions.users.first();
        const farmOwner = (mentionedUser == undefined) ? owner : mentionedUser;

        const farmResults = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${farmOwner.id}' LIMIT 1`);
        const farm = farmResults.rows[0];

        if (farm == undefined && command != "help" && command != "zaloz") {
            if (owner.id == farmOwner.id) {
                message.channel.send(`${farmOwner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            } else {
                message.channel.send(`${farmOwner} nie ma jeszcze farmy.`);
            }
            return;
        }

        const farmCommandFiles = fs.readdirSync('./commands/farm_commands/').filter(file => file.endsWith('.js'));
        for (const file of farmCommandFiles) {
            const command = require(`./farm_commands/${file}`);
            commands.set(command.name, command);
        }

        try {
            await commands.get(command).execute(args, message, dbclient, farmOwner, farm, commands);
        } catch (err) {
            console.error(err.stack);
            message.channel.send(`${message.author} nie rozumiem o co Ci chodzi, farmerze. (${err.message})`);
        }
    }
}