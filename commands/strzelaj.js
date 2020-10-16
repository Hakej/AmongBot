module.exports = {
    name: 'strzelaj',
    description: "This is a strzelaj command",
    execute(message, args) {
        const path = require('path');
        const fs = require("fs");

        const member = message.channel.members.random();
        const fileName = path.join(__dirname, 'data', `${member.user.username}.txt`);
        fs.readFile(fileName, "utf-8", (err, data) => {
            const parsedData = parseInt(data);
            var hitCount = 0;

            if (!isNaN(parsedData)) {
                hitCount = parsedData;
            }

            hitCount += 1;

            fs.writeFile(fileName, hitCount.toString(), (err) => {
                if (err) console.log(err);
                message.channel.send(`${message.author} odstrzelił ${member}! Auć. Dostał w pysk już ${hitCount} razy.`);
            });
        });
    }
}