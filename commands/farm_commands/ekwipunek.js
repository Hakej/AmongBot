module.exports = {
    name: 'ekwipunek',
    usage: 'ekwipunek [kogo]',
    description: "sprawdź swój lub kogoś ekwipunek",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;
        const invOwner = (subArgs[0] == undefined) ? owner : message.mentions.users.first();

        if (invOwner == undefined) {
            message.channel.send(`${owner}, musisz kogoś @wybrać.`);
            return;
        }

        const inventoryResult = await dbclient.query(`SELECT item.name, inventory.amount FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${invOwner.id}'`);
        const inventory = inventoryResult.rows;

        if (inventory.length == 0) {
            if (owner.id == invOwner.id) {
                message.channel.send(`${invOwner}, masz pusty ekwipunek.`);
            } else {
                message.channel.send(`${invOwner} ma pusty ekwipunek.`);
            }
            return;
        }

        var msg = "";
        if (owner.id == invOwner.id) {
            msg += `${invOwner}, posiadasz:\n`
        } else {
            msg += `${invOwner} posiada:\n`
        }

        inventory.forEach((value) => {
            msg += `- **${value.name}**, *${value.amount}*\n`;
        })

        message.channel.send(msg);
    }
}