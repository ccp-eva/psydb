'use strict';
var DateOnlyServerSide = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    var type = (
        isNullable
        ? [ 'null', 'string' ]
        : 'string'
    );

    return {
        systemType: 'DateOnlyServerSide',
        type,
        format: 'date',
        // @rjsf treats this default as if the user has set it
        //default: '0000-00-00',
        unmarshalDateOnlyServerSide: true,
        ...additionalKeywords,
    }
};

module.exports = DateOnlyServerSide;

