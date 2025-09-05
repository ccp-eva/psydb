'use strict';
var { randItemCount } = require('../utils');
var Phone = require('./phone');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
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
