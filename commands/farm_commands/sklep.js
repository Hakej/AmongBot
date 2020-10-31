module.exports = {
    name: 'sklep',
    usage: 'sklep',
    description: "sprawdz co jest w sklepie",
    execute(subArgs, message, dbclient) {
        dbclient.then((client) => {
            client.query(`SELECT * FROM "item"`)
                .then((result) => {
                    try {
                        var parsedResults = [];
                        parsedResults.push({
                            name: "przedmiot",
                            buy_sell_price: "kup/sprzedaj",
                            maturation_duration: "czas"
                        });

                        result.rows.forEach((value) => {
                            parsedResults.push({
                                name: value.name,
                                buy_sell_price: `${value.buy_price?.toString()}/${value.sell_price?.toString()}`,
                                maturation_duration: (value.maturation_duration) ? value.maturation_duration.toString() : ''
                            })
                        });

                        const tableMaker = require('../../tableMaker');
                        const widths = [16, 13, 5];

                        const tm = new tableMaker(parsedResults, widths);
                        const tableMsg = tm.makeTable();

                        message.channel.send(tableMsg);
                    } catch (err) {
                        message.channel.send(`Coś się odjebało na zapleczu, zw. (${err.message})`);
                    }
                })
        })
    }
}