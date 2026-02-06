'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    // FIXME: respect definition
    var out = {
        country: 'DE',
        city: faker.location.city(),
        postcode: faker.location.zipCode('#####'),
        street: `${faker.location.street()} Strasse`,
        housenumber: String(faker.number.int({ min: 1, max: 150 })),
        affix: ''
    };

    return out;
}

module.exports = {
    getRandomValue
}
