'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
    }

    return out;
}

module.exports = {
    getRandomValue
}
