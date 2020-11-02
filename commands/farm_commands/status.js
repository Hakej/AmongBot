const moment = require('moment');

module.exports = {
    name: 'status',
    usage: 'status',
    description: "sprawdź status swojej farmy",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;

        const farmResults = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`);
        const farm = farmResults.rows[0];

        if (farm == undefined) {
            message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            return;
        }

        const plantedResults = await dbclient.query(`SELECT item.name AS "name", planted.amount AS "amount", planted.maturation_date AS "maturationDate" FROM "planted" INNER JOIN "item" ON item.id = planted.item_id WHERE user_id='${owner.id}'`);
        const plantedPlants = plantedResults.rows;

        if (plantedPlants.length == 0) {
            message.channel.send(`${message.author}, nie masz nic posadzonego.`);
            return;
        }

        const parsedResults = [{
            name: 'Przedmiot',
            amount: 'Ilosc',
            maturation_left: 'Minut do dojrzałości'
        }];

        const currentDate = new Date();
        const parsedDate = moment(currentDate).toDate();

        plantedPlants.forEach((value) => {
            const maturationDate = moment(value.maturationDate).toDate();
            parsedResults.push({
                name: value.name,
                amount: value.amount,
                maturation_left: (parsedDate < maturationDate) ? (Math.abs(maturationDate - parsedDate) / 60000).toFixed(2) : 'do zebrania'
            })
        });

        const tableMaker = require('../../tableMaker');
        const tm = new tableMaker(parsedResults, [20, 10, 20]);
        const tableMsg = tm.makeTable();

        message.channel.send(tableMsg);
    }
}