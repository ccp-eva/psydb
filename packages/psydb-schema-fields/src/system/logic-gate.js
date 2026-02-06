'use strict';
var LogicGate = ({ ...additionalKeywords } = {}) => ({
    systemType: 'LogicGate',
    type: 'string',
    enum: [ 'and', 'or' ],
    ...additionalKeywords
});

module.exports = LogicGate;
