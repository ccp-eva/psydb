'use strict';
var Id = require('./id');

var HelperSetItemId = ({ setId, systemProps, ...additionalKeywords}) => ({
    ...Id(),
    systemType: 'HelperSetItemId',
    systemProps: {
        setId,
        ...systemProps,
    },
    ...additionalKeywords
})

module.exports = HelperSetItemId;
