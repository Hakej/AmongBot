module.exports = {
    name: 'ping',
    description: "This is a ping command",
    execute(message, args) {
        if (message.author.username === "Bartkenzi") {
            message.channel.send(`${message.author} ping ding ding, wygrywasz **chuja** w *dupie*.`);
        }
        else {
            var randomNumber = Math.floor(Math.random() * (100 + 1));
            if (randomNumber === 0) {
                const names = ["misiaczku", "kochasiu", "lowelasie", "słodziaku", "pysiaczku", "kochaniutki", "kociaku"];
                const randomName = names[Math.floor(Math.random() * names.length)];
                message.channel.send(`${message.author} pong, ${randomName} ;) Dzisiaj jest twój szczęśliwy dzień.`);
                return;
            }

            message.channel.send(`${message.author} pong!`);
        }
    }
}