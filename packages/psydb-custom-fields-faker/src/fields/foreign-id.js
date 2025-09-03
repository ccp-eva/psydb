'use strict';
var { pick } = require('../utils');

var getRandomValue = (bag) => {
    var {
        definition,
        fromList = undefined,
        fromStore = undefined,
        count = 1,
    } = bag;

    var { props: { collection, isNullable, /*constraints*/ }} = definition;

    if (!fromList && !fromStore) {
        throw new Error('either "fromList" of "fromStore" are required')
    }


    if (fromStore) {
        fromList = Object.values(fromStore[collection]);
    }

    if (isNullable) {
        fromList = [ ...fromList, null ];
    }

    var out = pick({ from: fromList, count });
    return out;
}

module.exports = {
    getRandomValue
}
