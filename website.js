module.exports = {
    name: 'website',
    usage: 'website',
    description: "website package",
    launch(bot, client) {
        const cool = require('cool-ascii-faces');
        const express = require('express');
        const path = require('path');
        const PORT = process.env.PORT || 5000;

        express()
            .use(express.static(path.join(__dirname, 'public')))
            .set('views', path.join(__dirname, 'views'))
            .set('view engine', 'ejs')
            .get('/', (req, res) => res.send(`Hi, I'm AmongBot ${cool()}`))
            .get('/shoot', async (req, res) => {
                try {
                    const result = await client.query('SELECT * FROM "shoot"');
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

                        res.render('pages/shoot', parsedResults);
                    });
                } catch (err) {
                    console.error(err);
                    res.send("Error " + err);
                }
            })
            .listen(PORT, () => console.log(`Listening on ${PORT}`));
    }
}