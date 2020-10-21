module.exports = {
    name: 'orientacja',
    usage: 'orientacja',
    description: "poznaj swoją orientację seksualną na dziś",
    execute(message, args) {
        // UserID: Klawiszq
        if (message.author.id === "228202941750837248") {
            message.channel.send(`${message.author}, twoja dzisiejsza orientacja seksualna to **korwinizm**.`);
        } else {
            const sexualities = ["heteroseksualizm", "homoseksualizm", "biseksualizm", "demiseksualizm", "panseksualizm", "poliamoria", "aseksualizm"];
            const randomSexuality = sexualities[Math.floor(Math.random() * sexualities.length)];
            message.channel.send(`${message.author}, twoja dzisiejsza orientacja seksualna to **${randomSexuality}**.`);
        }
    }
}