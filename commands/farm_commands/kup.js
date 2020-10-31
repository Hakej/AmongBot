module.exports = {
    name: 'kup',
    usage: 'kup',
    description: "kup coś sobie",
    execute(subArgs, message) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz kupić, baranie?`);
            return;
        }

        const item = subArgs[0];

        console.log(`kup: ${item}`);
    }
}