'use strict';
var { entries } = require('@mpieva/psydb-core-utils');
var jss = require('@mpieva/psydb-schema-fields');
var { SchemaFactory, commonTransformers } = require('../utils');

var OneOf = ({ discriminate, schemas }) => {

    if (!(typeof discriminate === 'function')) {
        throw new Error('discriminate must be a function');
    }
    if (!(typeof schemas === 'object')) {
        throw new Error('schemas must be an object');
    }

    var cachedJSS = {};
    for (var [ k, mfs ] of entries(schemas)) {
        cachedJSS[k] = mfs.createJSONSchema();
    }

    var PsydbSchema = SchemaFactory({
        // FIXME: type override; see jss
        JSONSchema: (keywords) => (
            jss.OneOf({ ...keywords, type: undefined })
        ),
        T: ({ keywords, args }) => {
            var [{ transform, root, value, path = [] }] = args;
            var selected = discriminate({ value });
            
            if (!Object.keys(cachedJSS).includes(selected)) {
                var strpath = path.map(it => it.key).join('.');
                throw new Error(`discriminate in path "${strpath}" returned "${selected}" which has no schema`);
            }

            var keywords = cachedJSS[selected];

            var psyschema = schemas[selected];
            var T = psyschema.transformValue({
                transform: ({
                    path: localPath, root: localRoot, ...pass
                }) => (
                    transform({
                        path: [ ...path, ...(localPath || []) ], root, ...pass
                    })
                ),
                value,
            })

            //var T = transform({ keywords, root, value, path });
            return T;
        }
    });
    
    return PsydbSchema({ oneOf: Object.values(schemas) });
}

module.exports = OneOf;
