'use strict';
var Id = require('./id');

var HelperSetItemId = ({ setId, ...additionalKeywords}) => ({
    ...Id(),
    systemType: 'HelperSetItemId',
    systemProps: {
        setId,
    },
    ...additionalKeywords
})

module.exports = HelperSetItemId;
