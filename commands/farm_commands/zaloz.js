module.exports = {
    name: 'zaloz',
    usage: 'zaloz <nazwa>',
    description: "zaloz swoja farme",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;

        if (subArgs[0] == undefined) {
            message.channel.send(`${owner}, zapomniałeś o nazwie farmy, kowboju.`);
            return;
        }

        const farmName = subArgs[0];
        const farmResults = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`);
        const farm = farmResults.rows[0];

        if (farm == undefined) {
            await dbclient.query(`INSERT INTO "farm" VALUES ('${owner.id}', 1100, '${farmName}', 0, 1)`);
            message.channel.send(`${owner}, twoja farma o nazwie **${farmName}** została założona pomyślnie.`);
        } else {
            message.channel.send(`${owner}, nie zagalopowałeś się byczq? Masz już farmę.`);
        }
    }
}