'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { pick } = require('../utils');

var Phone = require('./phone');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    if (!count) {
        count = pick({
            from: range(minItems + 3),
            weights: [ 75, 20, 5 ]
        });
    }

    var out = [];
    for (var it = 0; it < count; it += 1) {
        out.push(Phone.getRandomValue({
            definition: { props: {} },
        }));
    }

    return out;
}

module.exports = {
    getRandomValue
}
