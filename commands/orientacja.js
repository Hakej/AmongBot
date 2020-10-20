module.exports = {
    name: 'orientacja',
    description: "This is a sexuality command",
    execute(message, args) {
        if (message.author.username === "Klawiszq") {
            message.channel.send(`${message.author}, twoja dzisiejsza orientacja seksualna to **korwinizm**.`);
        } else {
            const sexualities = ["heteroseksualizm", "homoseksualizm", "biseksualizm", "demiseksualizm", "panseksualizm", "poliamoria", "aseksualizm"];
            const randomSexuality = sexualities[Math.floor(Math.random() * sexualities.length)];
            message.channel.send(`${message.author}, twoja dzisiejsza orientacja seksualna to **${randomSexuality}**.`);
        }
    }
}