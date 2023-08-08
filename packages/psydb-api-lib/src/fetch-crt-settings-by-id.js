'use strict';
var inline = require('@cdxoo/inline-text');

var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');

var fetchOneCustomRecordType = require('./fetch-one-custom-record-type');

var fetchCRTSettingsById = async (options) => {
    var { db, id, wrap = false } = options;

    var crt = await fetchOneCustomRecordType({ db, id });
    if (!crt) {
        throw new RecordTypeNotFound(inline`
            could not find custom record type for
            id "${id}"
        `);
    }

    var converted = convertCRTRecordToSettings(crt);
    if (wrap === true) {
        return CRTSettings({ data: converted });
    }
    else {
        return converted;
    }
}

module.exports = fetchCRTSettingsById;
