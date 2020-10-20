module.exports = {
    name: 'orientacja',
    usage: 'orientacja',
    description: "poznaj swoją orientację seksualną na dziś",
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