'use strict';
var { range } = require('@mpieva/psydb-core-utils');
var { pick } = require('../utils');

var HelperSetItemId = require('./helper-set-item-id');

var getRandomValue = (bag) => {
    var { definition, fromList, fromStore, count } = bag;
    var { props: { setId, minItems = 0 }} = definition;

    if (!count) {
        count = pick({
            from: range(minItems + 3),
            weights: [ 75, 20, 5 ]
        });
    }

    var out = undefined;
    if (count === 0) {
        out = [];
    }
    else {
        out = HelperSetItemId.getRandomValue({
            definition: { props: { setId }},
            fromList, fromStore,
            count: count,
        });
    }

    return out;
}

module.exports = {
    getRandomValue
}
