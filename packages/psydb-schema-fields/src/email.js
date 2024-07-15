'use strict';
var Email = (keywords = {}) => {
    var { minLength, ...extraKeywords } = keywords;

    return {
        systemType: 'Email',
        type: 'string',
        ...((minLength === 0) ? {
            format: 'email-optional',
        } : {
            format: 'email',
        }),
        ...extraKeywords
    }
}

module.exports = Email;
