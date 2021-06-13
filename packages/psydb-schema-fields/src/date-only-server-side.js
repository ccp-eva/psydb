'use strict';
var DateOnlyServerSide = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'DateOnlyServerSide',
    type: 'string',
    format: 'date',
    // @rjsf treats this default as if the user has set it
    //default: '0000-00-00',
    unmarshalDateOnlyServerSide: true,
    ...additionalKeywords,
});

module.exports = DateOnlyServerSide;

