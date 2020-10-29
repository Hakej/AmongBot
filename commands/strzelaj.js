const { debug } = require('console');
const { isUndefined } = require('util');

module.exports = {
    name: 'strzelaj',
    usage: 'strzelaj',
    description: "odstrzel sobie kogoś",
    execute(message, args) {
        //message.channel.send(`${message.author} CO STRZELASZ DO POLAKA? (komenda wyłączona bo Hakej to leniwy chuj)`);
        const path = require('path');
        const fs = require("fs");
        const { Pool } = require('pg');
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.USER ? false : true
        });

        const member = message.channel.members.random();

        const client = pool.connect()
            .then((pool) => {
                pool.query(`SELECT times_shot FROM shoot WHERE userid='${member.id}' LIMIT 1`)
                    .then((result) => {
                        var timesShot = undefined;
                        var resultRow = result.rows[0];

                        if (!isUndefined(resultRow)) {
                            timesShot = resultRow.times_shot;
                        }

                        if (isUndefined(timesShot)) {
                            pool.query(`INSERT INTO "shoot" VALUES ('${member.id}', 1)`)
                                .then((result) => {
                                    if (member.id == message.author.id) {
                                        message.channel.send(`${message.author}, brawo debilu, odstrzeliłeś/aś sobie łeb. To twój **pierwszy** raz, więc chyba można nazwac to masturbacją.`);
                                    } else {
                                        message.channel.send(`${message.author} odstrzelił/a ${member}! Auć. Właśnie go rozdziewiczyłeś/aś, gdyż to jego/jej **pierwszy** raz!`);
                                    }
                                })
                        } else {
                            timesShot++;
                            pool.query(`UPDATE "shoot" SET "times_shot" = ${timesShot} WHERE userid='${member.id}'`)
                                .then((result) => {
                                    if (member.id == message.author.id) {
                                        message.channel.send(`${message.author}, brawo debilu, odstrzeliłeś/aś sobie łeb. To już twój **${timesShot}** raz.`);
                                    } else {
                                        message.channel.send(`${message.author} odstrzelił/a ${member}! Auć. Dostał/a w pysk już **${timesShot}** razy.`);
                                    }
                                })
                        }
                    })
            })
    }
}