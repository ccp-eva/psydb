'use strict';
var { randItemCount } = require('../utils');
var URLString = require('./url-string');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
    }

    var out = [];
    for (var it = 0; it < count; it += 1) {
        out.push(URLString.getRandomValue({
            definition: { props: {} },
        }));
    }

    return out;
}

module.exports = {
    getRandomValue
}
