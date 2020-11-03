module.exports = {
    name: 'help',
    usage: 'help',
    description: "wypisuje wszystkie komendy",
    execute: async (args, message, dbclient, farmOwner, farm, commands) => {
        var helpMessage = "";
        commands.forEach(function (value) {
            helpMessage += `-**${value.usage}** - ${value.description} \n`;
        });
        message.channel.send(helpMessage);
    }
}