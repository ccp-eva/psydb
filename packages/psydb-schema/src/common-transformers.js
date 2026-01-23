'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var keys = Object.keys;

var scalar = ({ mfschema, args }) => {
    var [{ transform, root, value, path = [] }] = args;
    return transform({ mfschema, root, value, path });
};

var object = ({ mfschema, args }) => {
    var { keywords } = mfschema;
    var { properties = {}, patternProperties = {} } = keywords;

    var [{
        transform, value: objectValue,
        ...internal
    }, options = {}] = args;

    var {
        usePatternRegexInPath = true, // XXX
    } = options;

    var { root = objectValue, path = [] } = internal;


    if (!objectValue) {
        return { shouldStore: false }
    }

    var T = transform({
        mfschema,
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
            var mfschema = properties[key];
            var propValue = objectValue[key];
            var propType = (
                Array.isArray(propValue)
                ? 'array'
                : typeof propValue
            );

            var propT = mfschema.transformValue({
                transform,
                root,
                value: propValue,
                path: [ ...path, { key, type: propType }],
            }, options);
            if (propT.shouldStore) {
                out[key] = propT.value
            }
        }

        // FIXME: ambigous patterns?
        for (var pattern of keys(patternProperties)) {
            var mfschema = patternProperties[pattern];
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

                var propT = mfschema.transformValue({
                    transform,
                    root,
                    value: propValue,
                    path: (
                        usePatternRegexInPath
                        ? [ ...path, { key: pattern, type: propType } ]
                        : [ ...path, { key, type: propType } ]
                    ),
                }, options)
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

module.exports = {
    scalar,
    object,
}
