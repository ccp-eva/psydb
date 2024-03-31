class CSVImportError extends Error {
    constructor (message, info = {}) {
        super(message);
        this.__info = info;
    }
    getInfo () {
        return this.__info;
    }
}

class UnknownCSVColumnKeys extends CSVImportError {
    constructor (unknownCSVColumnKeys) {
        super(`unknown csv column keys: "${unknownCSVColumnKeys}"`, {
            unknownCSVColumnKeys
        })
    }
}

module.exports = {
    CSVImportError,
    UnknownCSVColumnKeys,
}
