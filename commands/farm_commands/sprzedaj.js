module.exports = {
    name: 'sprzedaj',
    usage: 'sprzedaj <nazwa> [ilosc]',
    description: "sprzedaj coś sobie",
    execute(subArgs, message, dbclient) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz sprzedać, jełopie?`);
            return;
        }

        const itemName = subArgs[0];
        var amount = parseInt(subArgs[1]);
        if (isNaN(amount)) {
            amount = 1;
        }

        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`)
                .then((farmResult) => {
                    const farm = farmResult.rows[0];
                    if (farm == undefined) {
                        message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
                        return;
                    }

                    const money = farm.money;

                    client.query(`SELECT item.id AS "id", item.name AS "name", inventory.amount AS "amount", item.sell_price AS "price" FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}' AND item.name='${itemName}'`)
                        .then((result) => {
                            const item = result.rows[0];
                            if (item == undefined) {
                                message.channel.send(`${message.author}, nie masz takiej rzeczy jak **${itemName}**.`);
                                return;
                            }

                            if (amount > item.amount) {
                                message.channel.send(`${message.author}, nie masz tylu **${itemName}**. (masz *${item.amount}*, podałeś **${amount}**)`);
                                return;
                            }

                            const newAmount = item.amount - amount;
                            const totalPrice = item.price * amount;
                            const newMoney = money + totalPrice;

                            client.query(`UPDATE "farm" SET money=${newMoney} WHERE owner_user_id='${owner.id}'`)
                                .then(() => {
                                    if (newAmount != 0) {
                                        client.query(`UPDATE "inventory" SET amount=${newAmount} WHERE user_id = '${owner.id}' AND item_id = ${item.id}`)
                                            .then(() => sellMessage(amount, totalPrice));
                                    } else {
                                        client.query(`DELETE FROM "inventory" WHERE user_id='${owner.id}' AND item_id=${item.id}`)
                                            .then(() => sellMessage(amount, totalPrice));
                                    }
                                })
                        })
                })

        })

        function sellMessage(amount, totalPrice) {
            message.channel.send(`${message.author}, sprzedałeś ${amount} x **${itemName}** za *${totalPrice}* hajsu.`);
        }
    }
}