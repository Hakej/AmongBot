const moment = require('moment');

module.exports = {
    name: 'status',
    usage: 'status',
    description: "sprawdź status swojej lub kogoś farmy",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;
        const farmOwner = (subArgs[0] == undefined) ? owner : message.mentions.users.first();

        if (farmOwner == undefined) {
            message.channel.send(`${owner}, musisz kogoś @wybrać.`);
            return;
        }

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

        if (owner.id == farmOwner.id) {
            message.channel.send(`${farmOwner}, twoja farma **${farm.name}** ma **${farm.money}** hajsu i **${farm.experience}** expa.`);
        } else {
            message.channel.send(`Farma ${farmOwner} o nazwie **${farm.name}** ma **${farm.money}** hajsu i **${farm.experience}** expa.`);
        }
    }
}