const tableMaker = require('../../utility/tableMaker');

module.exports = {
    name: 'sklep',
    usage: 'sklep',
    description: "sprawdz co jest w sklepie",
    execute: async (subArgs, message, dbclient) => {
        const shopResult = await dbclient.query(`SELECT * FROM "item" ORDER BY maturation_duration, buy_price`);
        try {
            var parsedResults = [];
            parsedResults.push({
                name: "przedmiot",
                buy_sell_price: "kup/sprzedaj",
                maturation_duration: "czas",
                maturation_experience: "exp"
            });

            shopResult.rows.forEach((value) => {
                parsedResults.push({
                    name: value.name,
                    buy_sell_price: `${value.buy_price}/${value.sell_price}`,
                    maturation_duration: (value.maturation_duration) ? value.maturation_duration.toString() : '',
                    maturation_experience: (value.maturation_experience) ? value.maturation_experience.toString() : ''
                })
            });

            const widths = [16, 13, 5, 3];
            const tm = new tableMaker(parsedResults, widths);
            const tableMsg = tm.makeTable();

            message.channel.send(tableMsg);
        } catch (err) {
            message.channel.send(`Coś się popsuło na zapleczu, zw.(${err.message})`);
        }
    }
}