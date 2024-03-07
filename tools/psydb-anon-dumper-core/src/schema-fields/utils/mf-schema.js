class MFSchema {
    constructor (bag) {
        var { createJSONSchema, transformValue } = bag;
        this.createJSONSchema = createJSONSchema;
        this.transformValue = transformValue;
    }
}

module.exports = MFSchema;
