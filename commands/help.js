module.exports = {
    name: 'help',
    usage: 'help',
    description: "wypisuje wszystkie komendy",
    execute(message, args, dbclient, bot) {
        var helpMessage = "";
        bot.commands.forEach(value => {
            helpMessage += `-**${value.usage}** - ${value.description} \n`;
        });
        message.channel.send(helpMessage);
    }
}