'use strict';
var DateTime = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    var type = (
        isNullable
        ? [ 'null', 'string' ]
        : 'string'
    );

    return {
        systemType: 'DateTime',
        type,
        format: 'date-time',
        unmarshalDateTime: true,
        // @rjsf treats this default as if the user has set it
        //default: '0000-00-00T00:00:00Z',
        ...additionalKeywords,
    }
};

module.exports = DateTime;

