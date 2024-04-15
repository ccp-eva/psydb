class CSVImportError extends Error {
    constructor (message, info = {}) {
        super(message);
        this.name = 'CSVImportError';
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
        });
        this.name = 'UnknownCSVColumnKeys';
    }
}

module.exports = {
    CSVImportError,
    UnknownCSVColumnKeys,
}
