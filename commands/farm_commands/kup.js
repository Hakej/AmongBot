module.exports = {
    name: 'kup',
    usage: 'kup <nazwa> [ilosc]',
    description: "kup coś sobie",
    execute(subArgs, message, dbclient) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz kupić, baranie?`);
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
                .then((result) => {
                    const farm = result.rows[0];
                    if (farm == undefined) {
                        message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
                        return;
                    }

                    const money = farm.money;
                    client.query(`SELECT * FROM "item" WHERE name='${itemName}' LIMIT 1`)
                        .then((itemResults) => {
                            item = itemResults.rows[0];
                            if (item == undefined) {
                                message.channel.send(`${owner}, nie mam czegoś takiego w sklepie jak **${itemName}**.`)
                                return;
                            }

                            const totalPrice = item.buy_price * amount;

                            if (totalPrice > money) {
                                message.channel.send(`${owner}, nie masz tyle hajsu biedaku. (Masz *${money}*, potrzebujesz **${totalPrice}**).`);
                                return;
                            }

                            const newMoney = money - totalPrice;

                            client.query(`UPDATE "farm" SET money=${newMoney} WHERE owner_user_id='${owner.id}'`)
                                .then(() => {
                                    client.query(`SELECT amount FROM "inventory" WHERE user_id = '${owner.id}' AND item_id = ${item.id}`)
                                        .then((inventoryResults) => {
                                            inventoryItem = inventoryResults.rows[0];
                                            if (inventoryItem == undefined) {
                                                client.query(`INSERT INTO "inventory" VALUES ('${owner.id}', ${item.id}, ${amount})`)
                                                    .then(() => buyMessage(amount, totalPrice));
                                                return;
                                            }
                                            const newAmount = inventoryItem.amount + amount;
                                            client.query(`UPDATE "inventory" SET amount = ${newAmount} WHERE user_id = '${owner.id}' AND item_id = ${item.id}`)
                                                .then(() => buyMessage(amount, totalPrice));
                                        })
                                })

                        })
                })

        })

        function buyMessage(amount, totalPrice) {
            message.channel.send(`${message.author}, kupiłeś ${amount} x **${itemName}** za *${totalPrice}* hajsu.`);
        }
    }
}