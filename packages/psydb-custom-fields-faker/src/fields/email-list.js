'use strict';
var { randItemCount } = require('../utils');
var Email = require('./email');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
    }

    var out = [];
    for (var it = 0; it < count; it += 1) {
        out.push(Email.getRandomValue({
            definition: { props: {} },
        }));
    }

    return out;
}

module.exports = {
    getRandomValue
}
