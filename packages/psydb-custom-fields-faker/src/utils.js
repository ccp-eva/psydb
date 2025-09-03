'use strict';
var { faker } = require('@faker-js/faker');
var _pick = require('@cdxoo/pick-random-item');

var pick = (bag) => {
    var { from, ...options } = bag;
    return _pick(from, { generateRandom: faker.random.number, ...options });
}

module.exports = {
    pick
}
