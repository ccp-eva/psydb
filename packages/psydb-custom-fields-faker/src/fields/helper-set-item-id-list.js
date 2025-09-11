'use strict';
var { arrify } = require('@mpieva/psydb-core-utils');
var { randItemCount } = require('../utils');
var HelperSetItemId = require('./helper-set-item-id');

var getRandomValue = (bag) => {
    var { definition, fromList, fromStore, count } = bag;
    var { props: { setId, minItems = 0 }} = definition;

    if (count === undefined) {
        count = randItemCount({ minItems });
    }

    var out = [];
    if (count > 0) {
        out = HelperSetItemId.getRandomValue({
            definition: { props: { setId }},
            fromList, fromStore,
            count: count,
        });
    }

    return arrify(out);
}

module.exports = {
    getRandomValue
}
