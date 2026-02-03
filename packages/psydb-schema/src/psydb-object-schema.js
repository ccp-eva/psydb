'use strict';
var { entries } = Object;
var PsyDBSchema = require('./psydb-schema');

class PsyDBObjectSchema extends PsyDBSchema {
    constructor (bag) {
        super(bag);
        this.type = 'object';

        var { JSONSchema, T } = bag;
        if (!this.createJSONSchema && JSONSchema) {
            this.wrapJSS({ JSONSchema });
        }
        if (!this.transformValue && T) {
            this.transformValue = this.wrapT({ T });
        }
    }

    wrapJSS (bag) {
        var { JSONSchema } = bag;

        this.createJSONSchema = () => {
            var {
                // XXX: not sure if we want to pass to JSS
                // also we may want to have 'omittedKeywordsInJSS'
                // options or similar
                // XXX: for now we want to because check-anonymizer
                // requires it to determine which hooks need to exist
                //anonT, anonKeep, anonTPrefix,
                ...pass
            } = this.keywords;

            var nestedJSS = {};
            var nestingKeys = [
                'properties',
                'patternProperties'
            ];

            for (var nkey of nestingKeys) {
                var source = this.keywords[nkey];
                if (source) {
                    var target = nestedJSS[nkey] = {};
                    for (var [ k, mfs ] of entries(source)) {
                        try {
                            target[k] = mfs.createJSONSchema();
                        }
                        catch (e) {
                            e.message += ` at ${nkey}.${k}`;
                            throw e;
                        }
                    }
                }
            }

            return JSONSchema({ ...pass, ...nestedJSS });
        }
    }

    wrapT (bag) {
        var { T } = bag;
        return (...args) => T({ args, mfschema: this });
    }
}

module.exports = PsyDBObjectSchema;
