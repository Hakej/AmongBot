module.exports = {
    name: 'sprzedaj',
    usage: 'sprzedaj <przedmiot> [ilosc]',
    description: "sprzedaj coś sobie",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;

        if (subArgs[0] == undefined) {
            message.channel.send(`${owner}, no ale co chcesz sprzedać?`);
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

        const inventoryResult = await dbclient.query(`SELECT item.id AS "id", item.name AS "name", inventory.amount AS "amount", item.sell_price AS "price" FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}' AND item.name='${itemName}'`);
        const item = inventoryResult.rows[0];

        if (item == undefined) {
            message.channel.send(`${owner}, nie masz takiej rzeczy jak **${itemName}**.`);
            return;
        }

        if (amount > item.amount) {
            message.channel.send(`${owner}, nie masz tylu **${itemName}**. (masz *${item.amount}*, podałeś **${amount}**)`);
            return;
        }

        const newAmount = item.amount - amount;
        const totalPrice = item.price * amount;
        const newMoney = farm.money + totalPrice;

        await dbclient.query(`UPDATE "farm" SET money=${newMoney} WHERE owner_user_id='${owner.id}'`);

        if (newAmount != 0) {
            await dbclient.query(`UPDATE "inventory" SET amount=${newAmount} WHERE user_id = '${owner.id}' AND item_id = ${item.id}`);
        } else {
            await dbclient.query(`DELETE FROM "inventory" WHERE user_id='${owner.id}' AND item_id=${item.id}`);
        }

        message.channel.send(`${owner}, sprzedałeś ${amount} x **${itemName}** za *${totalPrice}* hajsu.`);
    }
}