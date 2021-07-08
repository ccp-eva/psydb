'use strict';

var fromFacets = (result) => {
    var {
        records,
        recordsCount
    } = result[0];

    recordsCount = (
        recordsCount.length
        ? recordsCount[0].COUNT
        : 0
    );

    return [ records, recordsCount ];
}

module.exports = fromFacets;
