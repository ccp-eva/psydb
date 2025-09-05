'use strict';
var EmailList = require('./email-list');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    var emails = EmailList.getRandomValue({ definition, count });
    var out = [];
    for (var [ ix, it ] of emails.entries()) {
        out.push({ email: it, isPrimary: ix === 0 });
    }
    return out;
}

module.exports = {
    getRandomValue
}
