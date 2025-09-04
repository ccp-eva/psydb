'use strict';
var { faker } = require('@faker-js/faker');
var _pick = require('@cdxoo/pick-random-item');
var { range } = require('@mpieva/psydb-core-utils');

var pick = (bag) => {
    var { from, ...options } = bag;
    return _pick(from, { generateRandom: faker.random.number, ...options });
}

var randItemCount = (bag) => {
    var { minItems = 0, weights = [ 75, 20, 5 ]} = bag;
    return pick({ from: range(minItems + 3), weights });
}

module.exports = {
    pick,
    randItemCount
}
