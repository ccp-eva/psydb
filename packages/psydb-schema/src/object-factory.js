'use strict';
var { copy, groupBy } = require('@mpieva/psydb-core-utils');

var PsyDBObjectSchema = require('./psydb-object-schema');
var SchemaFactory = require('./schema-factory');
var commonTransformers = require('./common-transformers');

var ObjectFactory = (bag) => {
    var factory = SchemaFactory({
        CLASS: PsyDBObjectSchema, T: commonTransformers.object, ...bag
    });

    var WrappedFactory = (...args) => {
        var mfschema = factory(...args);
        
        mfschema.descend = (path) => {
            if (typeof path === 'string') {
                path = path.split('.');
            }

            if (Array.isArray(path)) {
                var current = mfschema;
                for (var it of path) {
                    current = current.keywords.properties[it];
                }
                return current;
            }
            else {
                throw new Error(`cannot handle path "${path}"`);
            }
        }

        mfschema.required = (bag = {}) => {
            var { set: setkeys } = bag;
            if (setkeys) {
                mfschema.keywords.required = setkeys;
            }

            return mfschema;
        }

        mfschema.project = (bag) => {
            var {
                only: onlypaths,
                omit: omitpaths,
                __RENAME, // XXX OMG i dont wanna
            } = bag;
            var { keys, entries } = Object;

            if (onlypaths && omitpaths) {
                throw new Error('using both "only" and "omit" is not tested');
            }

            var onlygroups = createPathGroups(onlypaths);
            var omitgroups = createPathGroups(omitpaths);
            
            // TODO: is copy sufficient?
            //var projection = copy(mfschema);
            // XXX: omg what?
            var projection = WrappedFactory(...copy(args));
            //projection.keywords = copy(projection.keywords);

            var { properties, required } = projection.keywords;

            if (onlygroups) {
                for (var [ key, subschema ] of entries(properties)) {
                    if (keys(onlygroups).includes(key)) {
                        projection.keywords.properties[key] = properties[key].project?.({
                            only: onlygroups[key],
                            omit: omitgroups?.[key]
                        }) || properties[key];
                    }
                    else {
                        delete projection.keywords.properties[key];
                        if (required && required.includes(key)) {
                            projection.keywords.required = (
                                required.filter(it => it !== key)
                            );
                        }
                    }
                }
            }
            
            if (omitgroups) {
                for (var [ key, subschema ] of entries(properties)) {
                    if (
                        keys(omitgroups).includes(key)
                        && omitgroups[key].length === 0
                    ) {
                        delete properties[key];
                        if (required && required.includes(key)) {
                            projection.keywords.required = (
                                required.filter(it => it !== key)
                            );
                        }
                    }
                    else {
                        properties[key] = properties[key].project?.({
                            only: onlygroups?.[key],
                            omit: omitgroups[key]
                        }) || properties[key];
                    }
                }
            }

            // XXX: __RENAME
            if (__RENAME) {
                for (var { from, to } of __RENAME) {
                    if (properties[from]) {
                        projection.keywords.properties[to] = (
                            projection.keywords.properties[from]
                        );

                        delete projection.keywords.properties[from];
                        if (required && required.includes(from)) {
                            projection.keywords.required = [
                                ...required.filter(it => it !== from),
                                to
                            ];
                        }
                    }
                }
            }

            return projection;
        }

        return mfschema;
    }

    return WrappedFactory;
};

var createPathGroups = (paths = []) => {
    // NOTE: can either contain json pointers or an array of tokens
    paths = paths.map(it => (
        typeof it === 'string'
        ? it.split('/').slice(1) // TODO: split does not unescape ptr tokens
        : it
    ));

    var groups = {};
    for (var [ key, ...rest ] of paths) {
        if (!groups[key]) {
            groups[key] = [];
        }
        if (rest.length > 0) {
            groups[key].push(rest)
        }
    }

    return Object.keys(groups).length > 0 ? groups : undefined;
}

module.exports = ObjectFactory;
