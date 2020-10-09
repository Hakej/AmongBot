module.exports = {
    name: 'rand',
    description: "This is a rand command",
    execute(message, args) {
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        if (isNaN(randomNumber)) {
            message.channel.send('Coś ty kurwa za liczby mi podał?');
            return;
        }

        message.channel.send(`Wylosowano **${randomNumber}**.`);
    }
}