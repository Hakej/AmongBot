module.exports = {
    name: 'ktokurwi',
    description: "This is a ktokurwi command",
    execute(message, args) {
        const member = message.channel.members.random();
        message.channel.send(`${member} mi kurwi w ch000j.`);
    }
}