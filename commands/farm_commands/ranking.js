const tableMaker = require('../../utility/tableMaker');

module.exports = {
    name: 'ranking',
    usage: 'ranking',
    description: "spradź ranking farm",
    execute: async (args, message, dbclient) => {
        const farmResults = await dbclient.query(`SELECT * FROM "farm" ORDER BY experience DESC`);
        const farms = farmResults.rows;

        if (farms.length == 0) {
            message.channel.send(`${message.author}, nie ma żadnych farm na tym serwerze.`);
            return;
        }

        var parsedResults = [];
        parsedResults.push({
            owner: "właściciel",
            name: "nazwa",
            money: "hajs",
            level: "poziom"
        });

        for (const farm of farms) {
            parsedResults.push({
                owner: await message.channel.members.get(farm.owner_user_id).user.username,
                name: farm.name,
                money: farm.money.toString(),
                level: farm.level.toString()
            })
        }

        const widths = [20, 15, 6, 6];
        const tm = new tableMaker(parsedResults, widths);
        const tableMsg = tm.makeTable();

        message.channel.send(tableMsg);
    }
}