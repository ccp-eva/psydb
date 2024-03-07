'use strict';
var jss = require('@mpieva/psydb-schema-fields');
var { PsydbSchema, SchemaFactory, commonTransformers } = require('../utils');

var DefaultArray = (keywords) => {
    var sharedBag = { ...keywords };

    var PsydbSchema = SchemaFactory({
        JSONSchema: jss.DefaultArray,
        T: ({ keywords, args }) => {
            var { items: itemsPsydbSchema } = keywords;

            var [{ transform, value: arrayValue, ...internal }] = args;
            var { root = arrayValue, path = [] } = internal;

            if (!arrayValue) {
                return { shouldStore: false }
            }

            var T = transform({
                keywords,
                root,
                value: arrayValue,
                path,
            });

            if (T.shouldStore) {
                return T;
            }
            else if (T.shouldStore === undefined)  {
                var out = [];
                for (var [ ix, itemValue ] of arrayValue.entries()) {
                    var itemType = (
                        Array.isArray(itemValue)
                        ? 'array'
                        : typeof itemValue
                    );
                    var itemT = itemsPsydbSchema.transformValue({
                        transform,
                        root,
                        value: itemValue,
                        path: [ ...path, { key: String(ix), type: itemType }]
                    });
                    if (itemT.shouldStore) {
                        out.push(itemT.value)
                    }
                }
                return { shouldStore: true, value: out };
            }
            else {
                return { shouldStore: false };
            }
        }
    });
    
    return PsydbSchema(sharedBag)
}

module.exports = DefaultArray;
