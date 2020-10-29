module.exports = {
    name: 'jebac',
    usage: 'jebac',
    description: "Jebac PiS.",
    execute(message, args) {
        // UserID: Chocolate house?
        if (message.author.id === "325038195119095808") {
            message.channel.send(`${message.author}, **Ciebie** i **twój mikrofon**.`);
        }
        else {
            message.channel.send('**PiS**!');
        }
    }
}