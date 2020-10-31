module.exports = {
    name: 'sprzedaj',
    usage: 'sprzedaj',
    description: "sprzedaj coś sobie",
    execute(subArgs, message) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz sprzedać, jełopie?`);
            return;
        }

        const item = subArgs[0];

        console.log(`sprzedaj: ${item}`);
    }
}