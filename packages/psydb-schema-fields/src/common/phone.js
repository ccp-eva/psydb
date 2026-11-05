'use strict';
var Phone = (keywords = {}) => {
    var { minLength = 0, extraKeywords } = keywords;

    return {
        systemType: 'Phone',
        type: 'string',
        ...((minLength === 0) ? {
            format: 'phone-number-optional', // custom format
        } : {
            format: 'phone-number', // custom format
        }),
        ...extraKeywords
    }
}

module.exports = Phone;
