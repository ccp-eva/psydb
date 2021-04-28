'use strict';
var SaneString = ({
    type,
    minLength,
    maxLength,
    ...additionalKeywords
} = {}) => {
    // ${noLB}\w(${noLB}|\w)+
    // ${noLB}*\w${noLB}*
    // |
    // ${noLB}*\w(${noLB}|\w)*\w
    /*var noLB = '[^\\r\\n]';

    var lengthPatterm = (
        minLength || maxLength
        ? '{}'
        : undefined
    );*/
    return {
        systemType: 'SaneString',
        type: 'string',
        // FIXME: rjsf interprets this default as if the user isnt required
        // to put something in
        //default: '',
        // TODO: this needs a proper pattern
        pattern: '^[^\\r\\n]*$',

        // FIXME: in my opinion this is a stupid hacky way of doing that
        // but its the only way to transform bevore validation
        // TODO; rjsf does not suport costum ajv keywords for some reason
        allOf: [
            { transform: [ 'trim' ] },
            ...(
                minLength || maxLength
                ? [{
                    ...(minLength && { minLength }),
                    ...(maxLength && { maxLength }),
                }]
                : []
            ),
        ],

        ...additionalKeywords,
    };
}

module.exports = SaneString;
