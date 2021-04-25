'use strict';
var IdentifierString = require('./identifier-string');

var HelperSetItemId = ({ set, ...additionalKeywords}) => ({
    ...IdentifierString(),
    systemType: 'HelperSetItemId',
    systemProps: {
        set,
    },
    ...additionalKeywords
})

module.exports = HelperSetItemId;
