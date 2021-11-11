'use strict';
var createRecordLabel = require('./create-record-label');
var createRecordLabelFromCRT = require('./create-record-label-from-crt');

var applyRecordLabels = (options) => {
    var {
        customRecordType,
        definition,
        records
    } = options;

    var [ createFn, commonCreateOpts ] = (
        definition
        ? [ createRecordLabel, { definition }]
        : [ createRecordLabelFromCRT, { customRecordType }]
    )

    for (var it of records) {
        it._recordLabel = createFn({ ...commonCreateOpts, record: it });
    }
}

module.exports = applyRecordLabels;
