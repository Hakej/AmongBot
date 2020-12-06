module.exports = {
    name: 'ktokurwi',
    usage: 'ktokurwi',
    description: "znajduje kogoś kto kurwi",
    execute(message, args) {
        message.channel.send(`${message.author}, **Ty** kurwisz.`);
        // UserID: Makaroniara
        /*
        if (message.author.id === "226792069786632197") {
            message.channel.send(`${message.author}, Ty kurwisz jak **odgrzany w mikrofali makaron z serem**.`);
        } else {
            const member = message.channel.members.random();
            message.channel.send(`${member} mi kurwi w ch000j.`);
        }
        */
    }
}