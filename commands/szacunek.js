module.exports = {
    name: 'szacunek',
    description: "This is a respect command",
    execute(message, args) {

        if (message.author.username === "Mattsu") {
            message.channel.send(`${message.author}, jesteś gejem, nie zasługujesz na żaden szacunek. -69% [.I.] szacunku z mojej strony.`);
        }
        else {
            var randomNumber = Math.floor(Math.random() * (100 + 1));
            var barAmount = parseInt(randomNumber / 10);
            var bar = '[';

            for (var i = 0; i < 10; i++) {
                if (i < barAmount)
                    bar += 'I';
                else
                    bar += '-';
            }
            bar += ']';

            message.channel.send(`${message.author}, teraz zasługujesz na ${randomNumber}% ${bar} szacunku.`);
        }
    }
}