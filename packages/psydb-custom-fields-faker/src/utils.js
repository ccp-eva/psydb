'use strict';
var { faker } = require('@faker-js/faker');
var _pick = require('@cdxoo/pick-random-item');
var { range } = require('@mpieva/psydb-core-utils');

var pick = (bag) => {
    var { from, unique = true, count = 1, ...pass } = bag;
    
    if (unique && (count > from.length)) {
        count = from.length;
    }

    return _pick(from, {
        generateRandom: () => faker.number.float(),
        unique, count, ...pass
    });
}

var randItemCount = (bag) => {
    var { minItems = 0, weights = [ 75, 20, 5 ]} = bag;
    return pick({ from: range(minItems + 3).slice(-3), weights });
}

module.exports = {
    pick,
    randItemCount
}
