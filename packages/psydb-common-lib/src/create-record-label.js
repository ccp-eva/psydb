'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields } = require('@mpieva/psydb-custom-fields-common');

var createRecordLabel = (bag) => {
    // NOTE: this 'from' parameter, we dont handle it in CRTSettings()!!!! 
    var {
        definition, record, from,
        i18n, timezone, language, locale,
    } = bag;

    if (!definition) {
        return `${record._id}`;
    }
    if (!i18n) {
        i18n = { timezone, language, locale };
    }
    if (from && !from.startsWith('/')) {
        from = '/' + from;
    }

    var { format, tokens } = definition;

    var label = format,
        tokensRedacted = 0;
    for (var [index, token] of tokens.entries()) {
        var { systemType, dataPointer } = token;

        var value = (
            from
            ? jsonpointer.get(record, from)[dataPointer]
            : jsonpointer.get(record, dataPointer)
        );

        if (value === undefined) {
            value = '[REDACTED]';
            tokensRedacted += 1;
        }
        else {
            var stringify = Fields[systemType]?.stringifyValue;
            var str = stringify ? (
                stringify({
                    definition: token, value, i18n,
                    short: true, // NOTE: affects biologicalgender n such
                })
            ) : `[!!STRINGIFY_ERROR=${systemType}!!]`; // FIXME: related maybe?

            value = str;
        }
        label = label.replace('${#}', value);
    }

    if (tokensRedacted === tokens.length) {
        label = `${record._id} [REDACTED]`;
    }
    return label;
}

module.exports = createRecordLabel;
