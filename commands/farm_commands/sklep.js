module.exports = {
    name: 'sklep',
    usage: 'sklep',
    description: "sprawdz co jest w sklepie",
    execute(subArgs, message, dbclient) {
        dbclient.then((client) => {
            client.query(`SELECT * FROM "item"`)
                .then((result) => {
                    try {
                        const firstColWidth = 16;
                        const secondColWidth = 13;
                        const thirdColWidth = 5;

                        var shopTable = "```\n";
                        shopTable += addTableLine(firstColWidth, secondColWidth, thirdColWidth);

                        result.rows.unshift({
                            name: "przedmiot",
                            buy_price: "kup",
                            sell_price: "sprzedaj",
                            maturation_duration: "czas"
                        })

                        result.rows.forEach((value) => {
                            const name = value.name;
                            const buyAndSellPrice = `${value.buy_price?.toString()}/${value.sell_price?.toString()}`;
                            const maturationDuration = (value.maturation_duration) ? value.maturation_duration.toString() : '';

                            shopTable += `|`;
                            shopTable += name;
                            for (var i = 0; i < firstColWidth - name.length; i++) {
                                shopTable += ' ';
                            }

                            shopTable += '|';
                            shopTable += buyAndSellPrice;
                            for (var i = 0; i < secondColWidth - buyAndSellPrice.length; i++) {
                                shopTable += ' ';
                            }

                            shopTable += '|';
                            shopTable += maturationDuration;
                            for (var i = 0; i < thirdColWidth - maturationDuration.length; i++) {
                                shopTable += ' ';
                            }

                            shopTable += "|\n"
                            shopTable += addTableLine(firstColWidth, secondColWidth, thirdColWidth);
                        })
                        shopTable += "```";
                        message.channel.send(shopTable);
                    } catch (err) {
                        message.channel.send(`Coś się odjebało na zapleczu, zw. (${err.message})`);
                    }
                })
        })


        function addTableLine(firstColWidth, secondColWidth, thirdColWidth) {
            var tableLine = "+";
            for (var i = 0; i < firstColWidth; i++) {
                tableLine += '-';
            }
            tableLine += '+';
            for (var i = 0; i < secondColWidth; i++) {
                tableLine += '-';
            }
            tableLine += '+';
            for (var i = 0; i < thirdColWidth; i++) {
                tableLine += '-';
            }
            tableLine += "+\n";

            return tableLine;
        }
    }
}