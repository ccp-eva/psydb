'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    // FIXME: timezone probably
    // TODO: future?
    var d = faker.date.past({ years: 30 });
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
}

module.exports = {
    getRandomValue
}
