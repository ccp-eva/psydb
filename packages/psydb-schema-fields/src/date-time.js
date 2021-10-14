'use strict';
var DateTime = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    var base = {
        systemType: 'DateTime',
        type: (
            isNullable
            ? ['null', 'string']
            : 'string'
        ),
        format: 'date-time',
        unmarshalDateTime: true,
        // @rjsf treats this default as if the user has set it
        //default: '0000-00-00T00:00:00Z',
    };
    
    if (isNullable) {
        base.default = null;
    }

    return {
        ...base,
        ...additionalKeywords,
    }
};

module.exports = DateTime;

