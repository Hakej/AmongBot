module.exports = {
    name: 'hajs',
    usage: 'hajs',
    description: "sprawdź ile masz hajsu",
    execute(subArgs, message, dbclient) {
        dbclient.then((client) => {
            const owner = message.author;
            client.query(`SELECT * FROM "farm" WHERE owner_user_id='${owner.id}' LIMIT 1`)
                .then((result) => {
                    const farm = result.rows[0];
                    if (farm == undefined) {
                        message.channel.send(`${owner}, ty nie masz jeszcze farmy. (sprawdź **-farma help**)`);
                    } else {
                        message.channel.send(`${owner}, posiadasz **${farm.money}** hajsu.`);
                    }
                })
        })
    }
}