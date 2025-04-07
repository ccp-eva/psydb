'use strict';
var { createMatchStages } = require('@mpieva/psydb-custom-fields-mongo');

var QuickSearchStages = ({
    queryFields,
    fieldTypeConversions,
}) => {
    var sane = [];
    for (var it of queryFields) {
        var { systemType, dataPointer, value } = it;
        sane.push({
            definition: { systemType, pointer: dataPointer }, // FIXME
            input: value
        })
    }

    return createMatchStages({ from: sane, type: 'quick-search' });
}

module.exports = QuickSearchStages;
