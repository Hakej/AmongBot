module.exports = {
    name: 'website',
    usage: 'website',
    description: "website package",
    launch() {
        const cool = require('cool-ascii-faces');
        const express = require('express');
        const path = require('path');
        const PORT = process.env.PORT || 5000;

        const { Pool } = require('pg');
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.USER ? false : true
        });

        express()
            .use(express.static(path.join(__dirname, 'public')))
            .get('/', (req, res) => res.send(`Hi, I'm AmongBot ${cool()}`))
            .get('/db', async (req, res) => {
                try {
                    const client = await pool.connect();
                    const result = await client.query('SELECT * FROM test_table');
                    const results = { 'results': (result) ? result.rows : null };
                    res.json({ results: results })
                    client.release();
                } catch (err) {
                    console.error(err);
                    res.send("Error " + err);
                }
            })
            .listen(PORT, () => console.log(`Listening on ${PORT}`));
    }
}