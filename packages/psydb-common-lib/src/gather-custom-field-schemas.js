'use sttrict';
var jsonpointer = require('jsonpointer');
var { convertPathToPointer } = require('@mpieva/psydb-core-utils');

var gatherCustomFieldSchemas = (options = {}) => {
    var { schema, subChannels, asPointers } = options;
    if (Array.isArray(subChannels) && subChannels.length > 1) {
        return subChannels.reduce((acc, key) => ({
            ...acc,
            ...gatherCustomFieldSchemas({
                schema,
                subChannels: [ key ],
                asPointers
            })
        }), {})
    }
    else {
        var suffix = `properties.state.properties.custom.properties`;
        var path = (
            Array.isArray(subChannels)
            ? `properties.${subChannels[0]}.${suffix}`
            : suffix
        );
        //console.log(path);
        var fieldSchemas = jsonpointer.get(
            schema,
            convertPathToPointer(path)
        );
        //console.log({ fieldSchemas });
        if (!fieldSchemas || typeof fieldSchemas !== 'object') {
            throw new Error(`no field schemas found for path "${path}"`);
        }
        var out = Object.keys(fieldSchemas).reduce((acc, key) => {
            var keyPrefix = (
                path
                .split('.')
                .filter(it => !(it == 'properties' || it === 'state'))
                .join('.')
            );
            var outKey = `${keyPrefix}.${key}`;
            if (asPointers) {
                outKey = convertPathToPointer(outKey);
            }
            return {
                ...acc,
                [outKey]: fieldSchemas[key]
            }
        }, {});

        //console.log({ out });
        return out;
    }
}

module.exports = gatherCustomFieldSchemas;
