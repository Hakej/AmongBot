module.exports = {
    name: 'plec',
    usage: 'plec',
    description: "poznaj swoją płeć na dziś",
    execute(message, args) {
        if (message.author.username === "VoLtAnO") {
            message.channel.send(`${message.author}, twoja dzisiejsza płeć to **Voltano**.`);
        } else {
            const sexualities = ["mężczyzna", "kobieta", "genderfluid", "trans-mężczyzna", "trans-kobieta", "non-binary", "debil", "papaj", "helikopter bojowy", "Jurek Owsiak", "impostor", "ten przemiły Pan spod menelowego, który prosił Cię o 2zł, a ty go olałeś/aś i teraz nim jesteś."];
            const randomSexuality = sexualities[Math.floor(Math.random() * sexualities.length)];
            message.channel.send(`${message.author}, twoja dzisiejsza płeć to **${randomSexuality}**.`);
        }
    }
}