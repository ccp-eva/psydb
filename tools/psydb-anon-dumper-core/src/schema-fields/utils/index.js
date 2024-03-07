'use strict';
var { entries, without } = require('@mpieva/psydb-core-utils');
var PsydbSchema = require('./psydb-schema');
var keys = Object.keys;

// NOTE: manually we would have to do this:
//var AnyString = (keywords = {}) => {
//    var out = {}
//    out.createJSONSchema = () => jss.AnyString(keywords);
//    out.transformValue = (...args) => commonTransformers.scalar({
//        keywords,
//        args,
//    });
//
//    return out;
//}

var SchemaFactory = (bag) => {
    var {
        JSONSchema, // json schema creator functio
        T, // e.g. commonTransformers.scalar
    } = bag;

    return (keywords = {}) => {
        var {
            properties, patternProperties,
            items, prefixItems,
            oneOf,

            //if: jssIF, then: jssTHEN, else: jssELSE,
            //not: jssNOT
            ...pass
        } = keywords;

        if (properties) {
            for (var [ key, value ] of entries(properties)) {
                verifyIsPsydbSchema(value, `property "${key}"`);
            }
        }
        if (patternProperties) {
            for (var [ key, value ] of entries(patternProperties)) {
                verifyIsPsydbSchema(value, `patternProperty "${key}"`);
            }
        }

        verifyIsPsydbSchema(items, 'keyword "items"');
        verifyIsPsydbSchema(prefixItems, 'keyword "prefixItems"');

        if (oneOf) {
            for (var it of oneOf) {
                verifyIsPsydbSchema(it, `keyword "oneOf[${it}]"`);
            }
        }

        return new PsydbSchema({
            createJSONSchema: () => {
                var nestedJSS = {};

                if (properties) {
                    var bag = nestedJSS.properties = {};
                    for (var [ k, mfs ] of entries(properties)) {
                        bag[k] = mfs.createJSONSchema();
                    }
                }
                if (patternProperties) {
                    var bag = nestedJSS.patternProperties = {}
                    for (var [ k, mfs ] of entries(patternProperties)) {
                        bag[k] = mfs.createJSONSchema();
                    }
                }

                if (items) {
                    nestedJSS.items = items.createJSONSchema();
                }
                if (prefixItems) {
                    nestedJSS.prefixItems = prefixItems.createJSONSchema();
                }
                if (oneOf) {
                    nestedJSS.oneOf = oneOf.map(
                        it => it.createJSONSchema()
                    );
                }

                return JSONSchema({ ...nestedJSS, ...pass });
            },
            transformValue: (...args) => T({ args, keywords }),
        })
    }
};

var verifyIsPsydbSchema = (value, label) => {
    if (value === undefined) {
        return;
    }
    if (!(value instanceof PsydbSchema)) {
        throw new Error(`${label} not instance of PsydbSchema`);
    }
}

var commonTransformers = {
    'scalar': ({ keywords, args }) => {
        var [{ transform, root, value, path }] = args;
        return transform({ root, value, keywords, path });
    },
    'object': ({ keywords, args }) => {
        var { properties = {}, patternProperties = {} } = keywords;

        var [{ transform, value: objectValue, ...internal }] = args;
        var { root = objectValue, path = [] } = internal;


        if (!objectValue) {
            return { shouldStore: false }
        }

        var T = transform({
            keywords,
            root,
            value: objectValue,
            path,
        });

        if (T.shouldStore) {
            return T;
        }
        else if (T.shouldStore === undefined)  {
            var out = {}
            var staticPropKeys = keys(properties);

            for (var key of staticPropKeys) {
                var psyschema = properties[key];
                var propValue = objectValue[key];
                var propType = (
                    Array.isArray(propValue)
                    ? 'array'
                    : typeof propValue
                );

                var propT = psyschema.transformValue({
                    transform,
                    root,
                    value: propValue,
                    path: [ ...path, { key, type: propType }],
                })
                if (propT.shouldStore) {
                    out[key] = propT.value
                }
            }

            // FIXME: ambigous patterns?
            for (var pattern of keys(patternProperties)) {
                var psyschema = patternProperties[pattern];
                var rx = new RegExp(pattern);

                var matchingObjectKeys = without({
                    that: keys(objectValue),
                    without: staticPropKeys
                }).filter(it => rx.test(it))

                for (var key of matchingObjectKeys) {
                    var propValue = objectValue[key];
                    var propType = (
                        Array.isArray(propValue)
                        ? 'array'
                        : typeof propValue
                    );

                    var propT = psyschema.transformValue({
                        transform,
                        root,
                        value: propValue,
                        path: [ ...path, { key, type: propType } ],
                    })
                    if (propT.shouldStore) {
                        out[key] = propT.value
                    }
                }
            }

            return { shouldStore: true, value: out };
        }
        else {
            return { shouldStore: false };
        }
    }
}

module.exports = {
    PsydbSchema,
    SchemaFactory,
    commonTransformers
};
