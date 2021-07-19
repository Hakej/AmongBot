module.exports = {
    name: 'szacunek',
    usage: 'szacunek',
    description: "sprawdź na ile szacunku zasługujesz",
    execute(message, args) {
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