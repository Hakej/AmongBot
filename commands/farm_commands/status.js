const moment = require('moment');

module.exports = {
    name: 'status',
    usage: 'status',
    description: "sprawdź status swojej farmy",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;
        const farmResult = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`);
        const farm = farmResult.rows[0];

        if (farm == undefined) {
            message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            return;
        }

        message.channel.send(`${owner}, twoja farma **${farm.name}** ma **${farm.money}** hajsu i **${farm.experience}** expa.`);
    }
}