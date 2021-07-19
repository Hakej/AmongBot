const moment = require('moment');

module.exports = {
    name: 'posadz',
    usage: 'posadz <przedmiot> [ilosc]',
    description: "posadz coś sobie",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;

        if (subArgs[0] == undefined) {
            message.channel.send(`${owner}, no ale co chcesz posadzić, siebie?`);
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

        const plotResults = await dbclient.query(`SELECT amount FROM "inventory" WHERE item_id = 4 AND user_id='${owner.id}'`);
        const plot = plotResults.rows[0];

        if (plot == undefined) {
            message.channel.send(`${owner}, musisz kupić pola aby móc posadzić.`);
            return;
        }

        if (amount > plot.amount) {
            message.channel.send(`${owner}, nie masz wystarczająco pól aby tyle posadzić. (masz *${plot.amount}*, potrzebujesz **${amount}**)`);
            return;
        }

        const items = await dbclient.query(`SELECT item.id AS "id", item.name AS "name", inventory.amount AS "amount", item.maturation_duration AS "maturationDuration" FROM "inventory" INNER JOIN "item" ON item.id = inventory.item_id WHERE user_id='${owner.id}' AND item.name='${itemName}'`);
        const item = items.rows[0];

        if (item == undefined) {
            message.channel.send(`${owner}, nie masz takiej rzeczy jak **${itemName}**.`);
            return;
        }

        if (amount > item.amount) {
            message.channel.send(`${owner}, nie masz tylu **${itemName}**. (masz *${item.amount}*, podałeś **${amount}**)`);
            return;
        }

        if (item.maturationDuration == null) {
            message.channel.send(`${owner}, tego nie posadzisz byczq.`);
            return;
        }

        const newItemAmount = item.amount - amount;

        if (newItemAmount != 0) {
            await dbclient.query(`UPDATE "inventory" SET amount=${newItemAmount} WHERE user_id='${owner.id}' AND item_id = ${item.id}`);
        } else {
            await dbclient.query(`DELETE FROM "inventory" WHERE user_id='${owner.id}' AND item_id = ${item.id}`);
        }

        const newPlotAmount = plot.amount - amount;

        if (newPlotAmount != 0) {
            await dbclient.query(`UPDATE "inventory" SET amount=${newPlotAmount} WHERE user_id='${owner.id}' AND item_id = 4`);
        } else {
            await dbclient.query(`DELETE FROM "inventory" WHERE user_id='${owner.id}' AND item_id = 4`);
        }

        var date = new Date();
        var parsedDate = moment(date).add(item.maturationDuration, 's').format('YYYY-MM-DD HH:mm:ss');

        await dbclient.query(`INSERT INTO "planted" VALUES ('${owner.id}', ${item.id}, '${parsedDate}', ${amount})`);

        message.channel.send(`${owner}, posadziłeś  ${amount} x **${itemName}**. Urosną za *${item.maturationDuration / 60}* minut.`);
    }
}