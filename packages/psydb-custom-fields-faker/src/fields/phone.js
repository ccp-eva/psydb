'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    var out = faker.phone.phoneNumber('0###/#######');
    return out;
}

module.exports = {
    getRandomValue
}
