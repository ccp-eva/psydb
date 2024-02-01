'use strict';
var jsonpointer = require('jsonpointer');
var stringifiers = require('@mpieva/psydb-common-lib/src/field-stringifiers');

var createRecordLabel = (bag) => {
    var {
        definition, record, from,
        timezone, language, locale,
    } = bag;

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
        var { systemType, dataPointer } = token;

        var value = (
            from
            ? record[from][dataPointer]
            : jsonpointer.get(record, dataPointer)
        );

        if (value === undefined) {
            value = '[REDACTED]';
            tokensRedacted += 1;
        }
        else {
            var stringify = stringifiers[systemType];
            if (stringify) {
                value = stringify(value, {
                    short: true,
                    timezone, language, locale,
                });
            }
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
