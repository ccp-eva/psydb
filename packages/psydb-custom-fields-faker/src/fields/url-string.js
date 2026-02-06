'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = faker.internet.url();
    return out;
}

module.exports = {
    getRandomValue
}
