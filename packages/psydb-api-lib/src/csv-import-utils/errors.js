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
            keys: unknownCSVColumnKeys
        });
        this.name = 'UnknownCSVColumnKeys';
    }
}

class MissingCSVColumnValues extends CSVImportError {
    constructor (bag) {
        var { keys, line } = bag;
        super(`missing csv column values for: "${keys}" in line ${line}`, {
            keys, line
        });
        this.name = 'MissingCSVColumnValues';
    }
}
module.exports = {
    CSVImportError,
    UnknownCSVColumnKeys,
    MissingCSVColumnValues,
}
