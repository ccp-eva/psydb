'use strict';
var { copy } = require('copy-anything');
var traverse = require('@cdxoo/traverse');

var createUnmarshalSchema = (schema) => {
    // its important to copy the stuff or else we
    // change he original schema
    var out = copy(schema);

    traverse(out, (node) => {
        var { key, value, path, parentNode, isLeaf } = node;
        if (isLeaf) {
            // adding unmarshal keywords to supported formats
            if (key === 'format') {
                if (
                    value === 'date-time'
                    || value === 'date-only-server-side'
                ) {
                    var { systemType } = parentNode.value;
                    if (systemType === 'DateTime') {
                        parentNode.value.type = [
                            ...arrify(parentNode.value.type),
                            'object'
                        ];
                        delete parentNode.value.format;
                        parentNode.value.unmarshalDateTime = true;
                    }
                    else if (systemType === 'DateOnlyServerSide') {
                        parentNode.value.type = [
                            ...arrify(parentNode.value.type),
                            'object'
                        ];
                        delete parentNode.value.format;
                        parentNode.value.unmarshalDateOnlyServerSide = true;
                    }
                }
                if (value === 'mongodb-object-id') {
                    parentNode.value.type = [
                        ...arrify(parentNode.value.type),
                        'object'
                    ];
                    delete parentNode.value.format;
                    parentNode.value.unmarshalMongodbObjectId = true;
                }
            }
        }
        // removing all $data refs since they break when umarshal keywords
        // are doing their thing
        if (key === '$data') {
            var parentKey = parentNode.key;
            delete parentNode.parentNode.value[parentKey];
        }
    }, { traverseArrays: true });

    //console.dir(out, { depth: null });
    return out;
}

var arrify = (that) => (
    Array.isArray(that)
    ? that
    : [ that ]
);

module.exports = createUnmarshalSchema;
