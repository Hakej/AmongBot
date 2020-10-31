module.exports = {
    name: 'sasin',
    usage: 'sasin <liczba>',
    description: "przelicz ile sasinów wynosi liczba jaką podałaś",
    execute(message, args) {
        if (isNaN(args[0])) {
            message.channel.send(`${message.author}, a gdzie wartość, debilu?`);
            return;
        }
        const oneSasin = 70000000;
        const answer = args[0] / oneSasin;
        message.channel.send(`${message.author}, twoja liczba (*${args[0]}*) wynosi dokładnie **${answer}** sasinów!`);
    }
}