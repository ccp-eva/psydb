'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    // FIXME: bounds based on definition
    var out = faker.number.int({ min: 10, max: 100 });
    return out;
}

module.exports = {
    getRandomValue
}
