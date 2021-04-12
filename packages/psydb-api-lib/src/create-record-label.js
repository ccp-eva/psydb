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
    for (var [index, token] of tokens.entries()) {
        var value = jsonpointer.get(record, token.dataPointer);
        if (value === undefined) {
            value = '[REDACTED]';
            tokensRedacted += 1;
        }
        label = label.replace(
            '${#}',
            value
        );
    }

    if (tokensRedacted === tokens.length) {
        label = `${record._id} [REDACTED]`;
    }
    return label;
}

module.exports = createRecordLabel;
