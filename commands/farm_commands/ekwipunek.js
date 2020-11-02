module.exports = {
    name: 'ekwipunek',
    usage: 'ekwipunek',
    description: "sprawdź co masz",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;
        const inventoryResult = await dbclient.query(`SELECT item.name, inventory.amount FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}'`);
        const inventory = inventoryResult.rows;

        if (inventory.length == 0) {
            message.channel.send(`${owner}, masz pusty ekwipunek.`);
            return;
        }

        var msg = `${owner}, posiadasz:\n`;
        inventory.forEach((value) => {
            msg += `- **${value.name}**, *${value.amount}*\n`;
        })

        message.channel.send(msg);
    }
}