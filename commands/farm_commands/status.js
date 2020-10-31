module.exports = {
    name: 'status',
    usage: 'status',
    description: "sprawdź status swojej farmy",
    execute(subArgs, message, dbclient, commands, moment) {
        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`)
                .then((result) => {
                    const farm = result.rows[0];
                    if (farm == undefined) {
                        message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
                        return;
                    }

                    client.query(`SELECT item.name AS "name", planted.amount AS "amount", planted.maturation_date AS "maturationDate" FROM "planted" INNER JOIN "item" ON item.id = planted.item_id WHERE user_id='${owner.id}'`)
                        .then((result) => {
                            const plantedPlants = result.rows;

                            if (plantedPlants.length == 0) {
                                message.channel.send(`${message.author}, nie masz nic posadzonego.`);
                                return;
                            }

                            const parsedResults = [{
                                name: 'Przedmiot',
                                amount: 'Ilosc',
                                maturation_left: 'Data dojrzałości'
                            }];

                            const currentDate = new Date();
                            var parsedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');

                            plantedPlants.forEach((value) => {
                                const maturationDate = moment(value.maturationDate).format('YYYY-MM-DD HH:mm:ss');
                                parsedResults.push({
                                    name: value.name,
                                    amount: value.amount,
                                    maturation_left: (parsedDate < maturationDate) ? maturationDate : 'do zebrania'
                                })
                            });

                            const tableMaker = require('../../tableMaker');
                            const tm = new tableMaker(parsedResults, [20, 10, 20]);
                            const tableMsg = tm.makeTable();

                            message.channel.send(tableMsg);
                        })
                })
        })
    }
}