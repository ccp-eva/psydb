'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    // FIXME: timezone probably
    // TODO: future
    var d = faker.date.past(30);
    return d;
}

module.exports = {
    getRandomValue
}
