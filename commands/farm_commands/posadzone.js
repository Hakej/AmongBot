const moment = require('moment');
const tableMaker = require('../../utility/tableMaker');

module.exports = {
    name: 'posadzone',
    usage: 'posadzone [kogo]',
    description: "sprawdź co masz (lub ktoś ma) posadzone na swojej farmie",
    execute: async (subArgs, message, dbclient, farmOwner) => {
        const owner = message.author;
        const plantedResults = await dbclient.query(`SELECT item.name AS "name", planted.amount AS "amount", planted.maturation_date AS "maturationDate" FROM "planted" INNER JOIN "item" ON item.id = planted.item_id WHERE user_id='${farmOwner.id}'`);
        const plantedPlants = plantedResults.rows;

        if (plantedPlants.length == 0) {
            if (owner.id == farmOwner.id) {
                message.channel.send(`${farmOwner}, nie masz nic posadzonego.`);
            } else {
                message.channel.send(`${farmOwner} nie ma nic posadzonego.`);
            }
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

        const tm = new tableMaker(parsedResults, [20, 10, 20]);
        const tableMsg = tm.makeTable();

        message.channel.send(tableMsg);
    }
}