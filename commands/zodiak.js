module.exports = {
    name: 'zodiak',
    usage: 'zodiak',
    description: "poznaj swój znak zodiaku na dziś",
    execute(message, args) {
        // UserID: Hakej
        if (message.author.id === "230097205359411202") {
            message.channel.send(`${message.author}, twój dzisiejszy znak zodiaku to **Sagittarius A\*: *Ruchanie***.`);
        } else {
            const types = ["Słońce", "Księżyc", "Merkury", "Wenus", "Mars", "Jowisz", "Saturn", "Uran", "Neptun", "Pluton", "Rising", "Szczecin", "Siedziba PiS'u", "Buda"];
            const signs = ["Baran", "Byk", "Bliźnięta", "Rak", "Lew", "Panna", "Waga", "Skorpion", "Strzelec", "Koziorożec", "Wodnik", "Ryby", "Jan Paweł II", "Kebab", "Pies"];

            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomSign = signs[Math.floor(Math.random() * signs.length)];

            message.channel.send(`${message.author}, twój dzisiejszy znak zodiaku to **${randomType}: *${randomSign}***.`);
        }
    }
}