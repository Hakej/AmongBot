const { isUndefined } = require('util');
const config = require('./../config.json');

module.exports = {
    name: 'strzelaj',
    usage: 'strzelaj',
    description: "odstrzel sobie kogoś",
    execute(message, args, dbclient) {
        const members = message.channel.members.filter(m => m.roles.cache.filter(r => r.id == config.shootingRoleID).size != 0);
        const member = members.random();

        dbclient.then((pool) => {
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