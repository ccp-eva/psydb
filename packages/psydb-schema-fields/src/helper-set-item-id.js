'use strict';
var Id = require('./id');

var HelperSetItemId = (bag) => {
    var {
        setId,
        systemProps,
        ...additionalKeywords
    } = bag;

    return Id({
        systemType: 'HelperSetItemId',
        systemProps: {
            setId: String(setId),
            ...systemProps,
        },
        ...additionalKeywords
    });
}

module.exports = HelperSetItemId;
