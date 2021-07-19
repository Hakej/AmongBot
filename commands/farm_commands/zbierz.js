const utils = require('../../utility/utils');

module.exports = {
    name: 'zbierz',
    usage: 'zbierz',
    description: "zbierz wsio",
    execute: async (subArgs, message, dbclient, farmOwner, farm) => {
        const owner = message.author;

        const plantedResults = await dbclient.query(`WITH sum AS (SELECT user_id, item.mature_item_id AS mature_item_id, item.maturation_experience AS maturation_experience, SUM (CASE WHEN CURRENT_TIMESTAMP > maturation_date THEN amount ELSE null END) AS total FROM planted INNER JOIN item ON item.id = item_id GROUP BY user_id, item.mature_item_id, item.maturation_experience) SELECT user_id, mature_item_id, maturation_experience, total FROM sum WHERE sum IS NOT NULL AND user_id='${owner.id}'`);
        const grownPlants = plantedResults.rows;

        if (grownPlants.length == 0) {
            message.channel.send(`${owner}, nie masz nic co urosło. ;)`);
            return;
        }

        const inventoryResults = await dbclient.query(`SELECT * FROM "inventory" WHERE user_id='${owner.id}'`);
        var totalPlantCount = 0;
        var totalExperienceGained = 0;

        for (const plant of grownPlants) {
            const plantInInv = inventoryResults.rows.filter(obj => {
                return obj.item_id === plant.mature_item_id;
            })

            const amount = (plantInInv[0]) ? plantInInv[0].amount : 0;
            const plantGathered = parseInt(plant.total);
            const newAmount = plantGathered + amount;
            totalPlantCount += plantGathered;

            if (plantInInv.length == 0) {
                await dbclient.query(`INSERT INTO "inventory" VALUES ('${owner.id}', ${plant.mature_item_id}, ${newAmount})`);
            } else {
                await dbclient.query(`UPDATE "inventory" SET amount=${newAmount} WHERE user_id='${owner.id}' AND item_id=${plant.mature_item_id}`);
            }

            totalExperienceGained += plant.maturation_experience * plantGathered;
        }

        const plotsInInv = inventoryResults.rows.filter(obj => {
            return obj.item_id === 4;
        })

        const plotAmount = (plotsInInv[0]) ? plotsInInv[0].amount : 0;
        const newPlotAmount = parseInt(totalPlantCount) + plotAmount;

        if (plotsInInv.length == 0) {
            await dbclient.query(`INSERT INTO "inventory" VALUES ('${owner.id}', 4, ${newPlotAmount})`);
        }
        else {
            await dbclient.query(`UPDATE "inventory" SET amount=${newPlotAmount} WHERE user_id='${owner.id}' AND item_id=4`);
        }

        const experienceResult = await dbclient.query(`SELECT experience FROM "farm" WHERE owner_user_id='${owner.id}'`);
        const experience = parseInt(experienceResult.rows[0].experience);
        const newExperience = experience + totalExperienceGained;

        await dbclient.query(`UPDATE "farm" SET experience=${newExperience} WHERE owner_user_id='${owner.id}'`);
        await dbclient.query(`DELETE FROM "planted" WHERE CURRENT_TIMESTAMP > maturation_date AND user_id='${owner.id}'`);

        message.channel.send(`${owner}, zebrano plony. Uzyskałeś/aś za to łącznie **${totalExperienceGained}** expa.`);

        const levelUps = utils.farmCalculateLevel(farm.level, farm.experience + totalExperienceGained);

        if (levelUps == 0) return;

        const newLevel = farm.level + levelUps;
        await dbclient.query(`UPDATE "farm" SET level=${newLevel} WHERE owner_user_id='${farmOwner.id}'`)
        message.channel.send(`${farmOwner}, twoja farma osiągnęła **${newLevel}** poziom!`);
    }
}