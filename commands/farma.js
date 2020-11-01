const Map = require("collections/map");
const fs = require("fs");

module.exports = {
    name: 'farma',
    usage: 'farma',
    description: "pobaw się na swojej farmie",
    execute(message, args, dbclient, bot, moment) {
        const config = require('./../config.json');
        const farmChannelID = config.farmChannelID;

        if (message.channel.id != farmChannelID) {
            bot.channels.fetch(farmChannelID)
                .then((farmChannel) => {
                    message.channel.send(`${message.author}, zmykaj na ${farmChannel} farmerze.`);
                })
            return;
        }

        if (args[0] == null) {
            message.channel.send(`${message.author}, brakuje podkomendy kolego. (sprawdź ** -farma help **)`);
            return;
        }

        const commands = new Map();

        const farmCommandFiles = fs.readdirSync('./commands/farm_commands/').filter(file => file.endsWith('.js'));
        for (const file of farmCommandFiles) {
            const command = require(`./farm_commands/${file}`);
            commands.set(command.name, command);
        }

        const command = args.shift();
        try {
            commands.get(command).execute(args, message, dbclient, commands, moment);
        } catch (err) {
            message.channel.send(`${message.author} nie rozumiem o co Ci chodzi, farmerze. (${err.message})`);
        }
    }
}