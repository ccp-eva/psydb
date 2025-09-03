'use strict';
var { faker } = require('@faker-js/faker');

var getRandomValue = (bag) => {
    var { definition } = bag;

    // FIXME: respect definition
    var out = {
        country: 'DE',
        city: faker.address.city(),
        postcode: faker.address.zipCode('#####'),
        street: `${faker.address.streetName()} Strasse`,
        housenumber: String(faker.datatype.number({ min: 1, max: 150 })),
        affix: ''
    };

    return out;
}

module.exports = {
    getRandomValue
}
