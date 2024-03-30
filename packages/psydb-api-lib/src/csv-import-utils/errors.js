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
    constructor (unknownColumnKeys) {
        super(`unknown csv column keys: "${unknownColumnKeys}"`, {
            unknownCSVColumnKeys
        })
    }
}

module.exports = {
    CSVImportError,
    UnknownCSVColumnKeys,
}
