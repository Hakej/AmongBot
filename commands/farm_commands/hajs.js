module.exports = {
    name: 'hajs',
    usage: 'hajs',
    description: "sprawdź ile masz hajsu",
    execute: async (subArgs, message, dbclient) => {
        const owner = message.author;
        const farmResult = await dbclient.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`);
        const farm = farmResult.rows[0];

        if (farm == undefined) {
            message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
            return;
        }

        message.channel.send(`${owner}, posiadasz **${farm.money}** hajsu.`);
    }
}