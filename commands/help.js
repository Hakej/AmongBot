module.exports = {
    name: 'help',
    description: "wypisuje wszystkie komendy",
    execute(message, commands) {
        var helpMessage = "";
        commands.forEach(function (value, key) {
            helpMessage += `-**${value.name}** - ${value.description} \n`;
        });
        message.channel.send(helpMessage);
    }
}