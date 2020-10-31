module.exports = {
    name: 'posadz',
    usage: 'posadz',
    description: "posadz coś sobie",
    execute(subArgs, message, dbclient, commands, moment) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, no ale co chcesz posadzić, siebie?`);
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

                    client.query(`SELECT item.id AS "id", item.name AS "name", inventory.amount AS "amount", item.maturation_duration AS "maturationDuration" FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}' AND item.name='${itemName}'`)
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

                            if (item.maturationDuration == null) {
                                message.channel.send(`${message.author}, w dupie se to posadź.`);
                                return;
                            }

                            const newItemAmount = item.amount - amount;
                            var itemQuery = "";
                            if (newItemAmount != 0) {
                                itemQuery += `UPDATE "inventory" SET amount=${newItemAmount}`;
                            } else {
                                itemQuery += `DELETE FROM "inventory"`
                            }
                            itemQuery += ` WHERE user_id='${owner.id}' AND item_id = ${item.id}`;

                            client.query(itemQuery)
                                .then(() => {
                                    client.query(`SELECT amount FROM "inventory" WHERE item_id = 4`)
                                        .then((plotResults) => {
                                            const plot = plotResults.rows[0];
                                            if (plot == undefined) {
                                                message.channel.send(`${message.author}, musisz kupić pola aby móc posadzić.`);
                                                return;
                                            }

                                            if (amount > plot.amount) {
                                                message.channel.send(`${message.author}, nie masz wystarczająco pól aby tyle posadzić. (masz *${plot.amount}*, potrzebujesz **${amount}**)`);
                                                return;
                                            }

                                            const newAmount = plot.amount - amount;
                                            var date = new Date();
                                            var parsedDate = moment(date).add(item.maturationDuration, 's').format('YYYY-MM-DD HH:mm:ss');

                                            var plotQuery = "";
                                            if (newAmount != 0) {
                                                plotQuery += `UPDATE "inventory" SET amount=${newAmount}`;
                                            } else {
                                                plotQuery += `DELETE FROM "inventory"`;
                                            }
                                            plotQuery += ` WHERE user_id='${owner.id}' AND item_id = 4`

                                            client.query(plotQuery)
                                                .then(() => {
                                                    client.query(`INSERT INTO "planted" VALUES ('${owner.id}', ${item.id}, '${parsedDate}', ${amount})`)
                                                        .then(() => {
                                                            message.channel.send(`${message.author}, posadziłeś  ${amount} x **${itemName}**. Urosną za *${item.maturationDuration / 60}* minut.`);
                                                        })
                                                });
                                        })
                                });
                        })
                })
        })
    }
}