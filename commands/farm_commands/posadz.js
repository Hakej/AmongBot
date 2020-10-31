module.exports = {
    name: 'posadz',
    usage: 'posadz',
    description: "posadz coś sobie",
    execute(subArgs, message) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz posadzić, siebie?`);
            return;
        }

        const item = subArgs[0];

        console.log(`posadz: ${item}`);
    }
}