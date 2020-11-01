module.exports = {
    name: 'zbierz',
    usage: 'zbierz',
    description: "zbierz wsio",
    execute(subArgs, message, dbclient) {
        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`)
                .then((result) => {
                    const farm = result.rows[0];
                    if (farm == undefined) {
                        message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
                        return;
                    }

                    client.query(`WITH sum AS (SELECT user_id, item.mature_item_id AS mature_item_id, SUM (CASE WHEN CURRENT_TIMESTAMP > maturation_date THEN amount ELSE null END) AS total FROM planted INNER JOIN item ON item.id = item_id GROUP BY user_id, item.mature_item_id) SELECT user_id, mature_item_id, total FROM sum WHERE sum IS NOT NULL AND user_id='${owner.id}'`)
                        .then((result) => {
                            const grownPlants = result.rows;

                            if (grownPlants.length == 0) {
                                message.channel.send(`${message.author}, nie masz nic co urosło. ;)`);
                                return;
                            }

                            client.query(`SELECT * FROM "inventory" WHERE user_id='${owner.id}'`)
                                .then((inventoryResults) => {
                                    var totalPlantCount = 0;
                                    grownPlants.forEach((plant) => {
                                        const plantInInv = inventoryResults.rows.filter(obj => {
                                            return obj.item_id === plant.mature_item_id;
                                        })

                                        const amount = (plantInInv[0]) ? plantInInv[0].amount : 0;
                                        const plantGathered = parseInt(plant.total);
                                        const newAmount = plantGathered + amount;

                                        var newAmountQuery = "";
                                        if (plantInInv.length == 0) {
                                            newAmountQuery = `INSERT INTO "inventory" VALUES ('${owner.id}', ${plant.mature_item_id}, ${newAmount})`;
                                        } else {
                                            newAmountQuery = `UPDATE "inventory" SET amount=${newAmount} WHERE user_id='${owner.id}' AND item_id=${plant.mature_item_id}`;
                                        }
                                        totalPlantCount += plantGathered;
                                        client.query(newAmountQuery);
                                    });

                                    const plotsInInv = inventoryResults.rows.filter(obj => {
                                        return obj.item_id === 4;
                                    })

                                    const plotAmount = (plotsInInv[0]) ? plotsInInv[0].amount : 0;
                                    const newPlotAmount = parseInt(totalPlantCount) + plotAmount;

                                    var retrievePlotsQuery = "";
                                    if (plotsInInv.length == 0) {
                                        retrievePlotsQuery = `INSERT INTO "inventory" VALUES ('${owner.id}', 4, ${newPlotAmount})`;
                                    }
                                    else {
                                        retrievePlotsQuery = `UPDATE "inventory" SET amount=${newPlotAmount} WHERE user_id='${owner.id}' AND item_id=4`;
                                    }
                                    client.query(retrievePlotsQuery)
                                        .then(() => {
                                            client.query(`DELETE FROM "planted" WHERE CURRENT_TIMESTAMP > maturation_date AND user_id='${owner.id}'`);
                                        })

                                    message.channel.send(`${message.author}, zebrano plony.`);
                                });
                        })
                })
        })
    }
}