'use strict';
var compose = require('koa-compose');

var forEachMail = (stages) => async (context, next) => {
    var { mails } = context;
    var composition = compose(stages);

    for (var it of mails) {
        try {
            await composition({ ...context, mail: it });
        }
        catch (e) {
            context.caughtErrors.push(e);
        }
    }

    await next();
}

module.exports = { forEachMail }
