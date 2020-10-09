module.exports = {
    name: 'sexuality',
    description: "This is a sexuality command",
    execute(message, args) {
        const sexualities = ["heteroseksualizm", "homoseksualizm", "biseksualizm", "demiseksualizm", "panseksualizm", "poliamoria", "aseksualizm"];
        const randomSexuality = sexualities[Math.floor(Math.random() * sexualities.length)];
        message.channel.send(`${message.author}, twoja dzisiejsza orientacja seksualna to **${randomSexuality}**.`);
    }
}