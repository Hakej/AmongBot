const fs = require('fs');
const text2png = require('text2png');

module.exports = {
    name: 'tekst',
    usage: 'tekst <tekst    > [-c <kolor>] [-a]',
    description: "wygeneruj sobie tekst o danym kolorze, -c wybiera kolor (słownie lub #rgb), -a autor komendy zostanie ukryty",
    execute(message, args) {
        var msg = "";
        var color = 'teal';
        var colorFlag = false;
        var anonymousFlag = false;

        for (const word of args) {
            if (word == '-c') {
                colorFlag = true;
                continue;
            }
            if (word == '-a') {
                anonymousFlag = true;
                continue;
            }
            if (colorFlag == true) {
                color = word;
                colorFlag = false;
                continue;
            }
            msg += word + " ";
        }

        const filePath = './commands/text2png_data/text.png';
        fs.writeFileSync(filePath, text2png(msg, {
            font: '80px Futura',
            color: color,
            lineSpacing: 10,
            padding: 20
        }));

        if (anonymousFlag == true) {
            message.delete();
        }

        message.channel.send({ files: [filePath] });
    }
}