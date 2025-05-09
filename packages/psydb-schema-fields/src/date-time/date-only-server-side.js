'use strict';
var DateOnlyServerSide = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    var base = {
        systemType: 'DateOnlyServerSide',
        type: (
            isNullable
            ? ['null', 'string']
            : 'string'
        ),
        format: 'date-only-server-side',
        // @rjsf treats this default as if the user has set it
        //default: '0000-00-00',
        //unmarshalDateOnlyServerSide: true,
    }
    
    if (isNullable) {
        base.default = null;
    }

    return {
        ...base,
        ...additionalKeywords,
    }
};

module.exports = DateOnlyServerSide;

