'use strict';
var { randItemCount } = require('../utils');
var SaneString = require('./sane-string');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
    }

    var out = [];
    for (var it = 0; it < count; it += 1) {
        out.push(SaneString.getRandomValue({
            definition: { props: { minLength: 1 }},
        }));
    }

    return out;
}

module.exports = {
    getRandomValue
}
