'use strict';
var { pick } = require('../utils');
var PhoneList = require('./phone-list');

var getRandomValue = (bag) => {
    var { definition, count } = bag;
    var { props: { minItems = 0 }} = definition;

    var phones = PhoneList.generateRandom({ definition, count });
    var out = [];
    for (var it of phones) {
        out.push({
            number: it,
            type: pick({
                // FIXME: mother/father based on definition
                from: [ 'private', 'mobile', 'business' ],
                weights: [ 50, 25, 25 ]
            })
        });
    }
    return out;
}

module.exports = {
    getRandomValue
}
