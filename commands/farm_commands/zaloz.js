module.exports = {
    name: 'zaloz',
    usage: 'zaloz <nazwa>',
    description: "zaloz swoja farme",
    execute(subArgs, message, dbclient) {
        if (subArgs[0] == undefined) {
            message.channel.send(`${message.author}, zapomniałeś o nazwie farmy, kowboju.`);
            return;
        }

        const farmName = subArgs[0];

        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`)
                .then((result) => {
                    const farm = result.rows[0];
                    if (farm == undefined) {
                        client.query(`INSERT INTO "farm" VALUES ('${owner.id}', 1100, '${farmName}')`);
                        message.channel.send(`${owner}, twoja farma o nazwie **${farmName}** została założona pomyślnie.`);
                    } else {
                        message.channel.send(`${owner}, nie zagalopowałeś się byczq? Masz już farmę.`);
                    }
                })
        })
    }
}