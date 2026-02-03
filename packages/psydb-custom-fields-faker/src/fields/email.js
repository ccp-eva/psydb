'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = faker.internet.email().replace('@', '_fake@');
    return out;
}

module.exports = {
    getRandomValue
}
