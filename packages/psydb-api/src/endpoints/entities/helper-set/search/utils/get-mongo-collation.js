'use strict';
var translationExists = require('./translation-exists');

var getMongoCollation = (bag = {}) => {
    var { language } = bag;

    var collation = (
        translationExists({ language })
        ? { locale: 'de@collation=phonebook' } // FIXME
        : undefined
    );

    return collation;
}

module.exports = getMongoCollation;
