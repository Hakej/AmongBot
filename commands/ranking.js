module.exports = {
    name: 'ranking',
    usage: 'ranking',
    description: "sprawdź ranking strzelania",
    execute(message, args, dbclient, bot) {
        try {
            dbclient.then((client) => {
                client.query('SELECT * FROM "shoot"').then((result) => {
                    const results = { 'results': (result) ? result.rows : null };
                    const parsedResults = { 'results': [] };

                    const parseValues = new Promise((resolve, reject) => {
                        results.results.forEach((value, index, array) => {
                            bot.users.fetch(value.userid)
                                .then((user) => {
                                    const parsedResult = {
                                        username: user.username,
                                        times_shot: value.times_shot
                                    }
                                    parsedResults.results.push(parsedResult);

                                    if (index === array.length - 1) resolve();
                                })
                        });
                    });

                    parseValues.then(() => {
                        // Sort alphabetically
                        parsedResults.results.sort(function (a, b) {
                            var textA = a.username.toUpperCase();
                            var textB = b.username.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });

                        const firstColWidth = 30;
                        const secondColWidth = 5;

                        parsedResults.results.unshift({
                            username: "UŻYTKOWNIK",
                            times_shot: "ILOŚĆ"
                        })

                        var rankTable = "```\n";
                        rankTable += addTableLine(firstColWidth, secondColWidth);

                        parsedResults.results.forEach((value) => {
                            const username = value.username;
                            const timesShot = value.times_shot.toString();
                            rankTable += `|`;
                            rankTable += username;
                            for (var i = 0; i < firstColWidth - username.length; i++) {
                                rankTable += ' ';
                            }
                            rankTable += '|';
                            rankTable += timesShot;
                            for (var i = 0; i < secondColWidth - timesShot.length; i++) {
                                rankTable += ' ';
                            }
                            rankTable += "|\n"
                            rankTable += addTableLine(firstColWidth, secondColWidth);
                        })
                        rankTable += "```";

                        if (rankTable.length < 2000) {
                            message.channel.send(rankTable);
                        } else {
                            const hastebin = require("hastebin-gen");
                            hastebin(rankTable, { extension: "txt" }).then(haste => {
                                message.channel.send(haste);
                            }).catch(error => {
                                console.error(error);
                                message.channel.send(`Coś nie pykło byczq. (${error.message})`);
                            });
                        }
                    })
                })
            })
        } catch (err) {
            console.error(err);
        }

        function addTableLine(firstColWidth, secondColWidth) {
            var tableLine = "+";
            for (var i = 0; i < firstColWidth; i++) {
                tableLine += '-';
            }
            tableLine += '+';
            for (var i = 0; i < secondColWidth; i++) {
                tableLine += '-';
            }
            tableLine += "+\n";

            return tableLine;
        }
    }
}