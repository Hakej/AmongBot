module.exports = {
    name: 'ping',
    description: "This is a ping command",
    execute(message, args) {
        if (message.author.username === "Bartkenzi") {
            message.channel.send(`${message.author} ping ding ding, wygrywasz **chuja** w *dupie*.`);
        }
        else {
            message.channel.send('pong!');
        }
    }
}