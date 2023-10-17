'use strict';
var { translationExists } = require('@mpieva/psydb-i18n');

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
