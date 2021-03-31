'use strict';
var jsonpointer = require('jsonpointer');

var createRecordLabel = ({ definition, record }) => {
    if (!definition) {
        return `${record._id}`;
    }

    var {
        format,
        tokens
    } = definition;

    var label = format,
        tokensRedacted = 0;
    for (var [index, pointer] of tokens.reverse().entries()) {
        // reversing index
        index = tokens.length - index - 1;
        var value = jsonpointer.get(record, pointer);
        if (value === undefined) {
            value = 'REDACTED';
            tokensRedacted += 1;
        }
        label = label.replace(
            '${' + index + '}',
            value
        );
    }

    if (tokensRedacted == tokens.length) {
        label = `${record._id}`;
    }
    
    return label;
}

module.exports = createRecordLabel;
