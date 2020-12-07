const { isUndefined } = require('util');
const config = require('./../config.json');

module.exports = {
    name: 'strzelaj',
    usage: 'strzelaj',
    description: "odstrzel sobie kogoś",
    execute: async (message, args, dbclient) => {
        if (message.member.roles.cache.filter(r => r.id == config.shootingRoleID).size == 0) {
            message.channel.send(`${message.author}, musisz mieć rolę <@&${config.shootingRoleID}> kowboju.`);
            return;
        }

        const members = message.channel.members.filter(m => m.roles.cache.filter(r => r.id == config.shootingRoleID).size != 0);
        const shotMember = members.random();
        const timesShotResult = await dbclient.query(`SELECT times_shot FROM shoot WHERE userid='${shotMember.id}' LIMIT 1`)

        var timesShot = undefined;
        var resultRow = timesShotResult.rows[0];

        if (!isUndefined(resultRow)) {
            timesShot = resultRow.times_shot;
        }

        if (isUndefined(timesShot)) {
            await dbclient.query(`INSERT INTO "shoot" VALUES ('${shotMember.id}', 1)`);

            if (shotMember.id == message.author.id) {
                message.channel.send(`${message.author}, brawo debilu, odstrzeliłeś/aś sobie łeb. To twój **pierwszy** raz, więc chyba można nazwac to masturbacją.`);
            } else {
                message.channel.send(`${message.author} odstrzelił/a ${shotMember}! Auć. Właśnie go rozdziewiczyłeś/aś, gdyż to jego/jej **pierwszy** raz!`);
            }

            return;
        }

        timesShot++;
        await dbclient.query(`UPDATE "shoot" SET "times_shot" = ${timesShot} WHERE userid='${shotMember.id}'`)

        if (shotMember.id == message.author.id) {
            message.channel.send(`${message.author}, brawo debilu, odstrzeliłeś/aś sobie łeb. To już twój **${timesShot}** raz.`);
        } else {
            message.channel.send(`${message.author} odstrzelił/a ${shotMember}! Auć. Dostał/a w pysk już **${timesShot}** razy.`);
        }
    }
}