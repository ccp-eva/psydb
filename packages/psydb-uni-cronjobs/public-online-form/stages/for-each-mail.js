'use strict';
var compose = require('koa-compose');

var forEachMail = (stages) => async (context, next) => {
    var composition = compose(stages);
    var { mails } = context;

    for (var it of mails) {
        try {
            await composition({ ...context, mail: it });
        }
        catch (e) {
            context.caughtErrors.push({ mail: it, e });
        }
    }

    await next();
}

module.exports = { forEachMail }
