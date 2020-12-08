const moment = require('moment');
const utils = require('../../utility/utils');

module.exports = {
    name: 'status',
    usage: 'status',
    description: "sprawdź status swojej lub kogoś farmy",
    execute: async (subArgs, message, dbclient, farmOwner) => {
        const owner = message.author;

        const farmResults = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${farmOwner.id}' LIMIT 1`);
        const farm = farmResults.rows[0];

        if (farm == undefined) {
            if (owner.id == farmOwner.id) {
                message.channel.send(`${farmOwner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            } else {
                message.channel.send(`${farmOwner} nie ma jeszcze farmy.`);
            }
            return;
        }

        const experienceNeeded = utils.farmCalculateExperienceNeeded(farm.level, farm.experience);
        if (owner.id == farmOwner.id) {
            message.channel.send(`${farmOwner}, twoja farma **${farm.name}** ma **${farm.money}** hajsu i **${farm.level}** poziom. Potrzebujesz *${experienceNeeded}* expa do następnego poziomu.`);
        } else {
            message.channel.send(`Farma ${farmOwner} o nazwie **${farm.name}** ma **${farm.money}** hajsu i **${farm.level}** poziom. Potrzebuje *${experienceNeeded}* expa do następnego poziomu.`);
        }
    }
}