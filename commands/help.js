module.exports = {
    name: 'help',
    usage: 'help',
    description: "wypisuje wszystkie komendy",
    execute(message, commands) {
        var helpMessage = "";
        commands.forEach(function (value, key) {
            helpMessage += `-**${value.usage}** - ${value.description} \n`;
        });
        message.channel.send(helpMessage);
    }
}