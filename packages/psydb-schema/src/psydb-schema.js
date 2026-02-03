'use strict';

class PsyDBSchema {
    constructor (bag) {
        var {
            keywords,
            createJSONSchema,
            transformValue
        } = bag;

        this.keywords = keywords;
        this.createJSONSchema = createJSONSchema;
        this.transformValue = transformValue;
    }
}

module.exports = PsyDBSchema;
