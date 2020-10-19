module.exports = {
    name: 'rand',
    description: "This is a rand command",
    execute(message, args) {
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);

        if (isNaN(min) || isNaN(max)) {
            message.channel.send('Coś ty kurwa za liczby mi podał?');
            return;
        }

        var tryManyTimes = false;
        if (args[2] == "-t") {
            tryManyTimes = true;
        }


        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (tryManyTimes) {
            for (var i = 1; i <= 1000; i++) {
                if (randomNumber === max) {
                    message.channel.send(`*${max}* udało się wylosować po **${i}** próbach.`);
                    return;
                }
                randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            message.channel.send(`Nie udało się wylosować ${max} nawet w **tysiącu** próbach.`);
            return;
        }

        message.channel.send(`Wylosowano **${randomNumber}**.`);
    }
}