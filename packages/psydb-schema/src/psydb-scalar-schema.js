'use strict';
var PsyDBSchema = require('./psydb-schema');

class PsyDBScalarSchema extends PsyDBSchema {
    constructor (bag) {
        super(bag);
        this.type = 'scalar';
        
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
        var { keywords } = this;

        this.createJSONSchema = () => {
            var {
                // XXX: not sure if we want to pass to JSS
                // also we may want to have 'omittedKeywordsInJSS'
                // options or similar
                // XXX: for now we want to because check-anonymizer
                // requires it to determine which hooks need to exist
                //anonT, anonKeep, anonTPrefix,
                ...pass
            } = keywords;

            return JSONSchema({ ...pass });
        }
    }
    
    wrapT (bag) {
        var { T } = bag;
        return (...args) => T({ args, mfschema: this });
    }
}

module.exports = PsyDBScalarSchema;
