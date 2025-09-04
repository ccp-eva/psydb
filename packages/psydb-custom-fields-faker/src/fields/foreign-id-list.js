'use strict';
var { randItemCount } = require('../utils');
var ForeignId = require('./foreign-id');

var getRandomValue = (bag) => {
    var { definition, fromList, fromStore, count } = bag;
    var { props: { collection, recordType, minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
    }

    var out = [];
    if (count > 0) {
        out = ForeignId.getRandomValue({
            definition: { props: { collection, recordType }},
            fromList, fromStore,
            count: count,
        });
    }

    return out;
}

module.exports = {
    getRandomValue
}
