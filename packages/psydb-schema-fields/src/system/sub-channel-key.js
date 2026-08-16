'use strict';
var SubChannelKey = ({ ...extraKeywords } = {}) => ({
    systemType: 'SubChannelKey',
    type: 'string',
    enum: [ 'scientific', 'gdpr' ],
    ...extraKeywords,
});

module.exports = SubChannelKey
