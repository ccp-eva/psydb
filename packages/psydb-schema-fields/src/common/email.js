'use strict';
var Email = (keywords = {}) => {
    var { minLength = 0, ...extraKeywords } = keywords;

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
