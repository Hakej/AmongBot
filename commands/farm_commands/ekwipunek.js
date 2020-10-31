module.exports = {
    name: 'ekwipunek',
    usage: 'ekwipunek',
    description: "sprawdź co masz",
    execute(subArgs, message, dbclient) {
        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT item.name, inventory.amount FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}'`)
                .then((result) => {
                    const inventory = result.rows;
                    if (inventory.length == 0) {
                        message.channel.send(`${owner}, masz pusty ekwipunek.`);
                    } else {
                        var msg = `${owner}, posiadasz:\n`;
                        inventory.forEach((value) => {
                            msg += `- **${value.name}**, *${value.amount}*\n`;
                        })
                        message.channel.send(msg);
                    }
                })
        })
    }
}