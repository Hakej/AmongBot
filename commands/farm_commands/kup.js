module.exports = {
    name: 'kup',
    usage: 'kup <nazwa> [ilosc]',
    description: "kup coś sobie",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;

        if (subArgs[0] == undefined) {
            message.channel.send(`${owner}, no ale co chcesz kupić?`);
            return;
        }

        const itemName = subArgs[0];

        var amount = parseInt(subArgs[1]);
        if (isNaN(amount)) {
            amount = 1;
        }

        const farmResults = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`);
        const farm = farmResults.rows[0];

        if (farm == undefined) {
            message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            return;
        }

        const itemResults = await dbclient.query(`SELECT * FROM "item" WHERE name='${itemName}' LIMIT 1`);
        const item = itemResults.rows[0];

        if (item == undefined) {
            message.channel.send(`${owner}, nie mam czegoś takiego w sklepie jak **${itemName}**.`)
            return;
        }

        const totalPrice = item.buy_price * amount;

        if (totalPrice > farm.money) {
            message.channel.send(`${owner}, nie masz tyle hajsu biedaku. (Masz *${farm.money}*, potrzebujesz **${totalPrice}**).`);
            return;
        }

        const newMoney = farm.money - totalPrice;

        await dbclient.query(`UPDATE "farm" SET money=${newMoney} WHERE owner_user_id='${owner.id}'`);

        const inventoryResults = await dbclient.query(`SELECT amount FROM "inventory" WHERE user_id = '${owner.id}' AND item_id = ${item.id}`);
        const inventoryItem = inventoryResults.rows[0];

        if (inventoryItem == undefined) {
            await dbclient.query(`INSERT INTO "inventory" VALUES ('${owner.id}', ${item.id}, ${amount})`)
        } else {
            const newAmount = inventoryItem.amount + amount;
            await dbclient.query(`UPDATE "inventory" SET amount = ${newAmount} WHERE user_id = '${owner.id}' AND item_id = ${item.id}`)
        }

        message.channel.send(`${owner}, kupiłeś ${amount} x **${itemName}** za *${totalPrice}* hajsu.`);
    }
}