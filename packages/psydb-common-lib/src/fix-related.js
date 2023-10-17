// TODO: fix the underlying code
var { flatten, unflatten } = require('@mpieva/psydb-core-utils');

const fixRelated = (raw, options = {}) => {
    console.info('FIXING RELATED');
    var {
        isResponse = true,
        labelize = false
    } = options;

    var out = {
        crts: {},
        records: {},
        helperSets: {},
    };
    
    if (raw.relatedCustomRecordTypes) {
        out.crts = raw.relatedCustomRecordTypes;
    }
    if (raw.relatedCustomRecordTypeLabels) {
        out.crts = raw.relatedCustomRecordTypeLabels;
    }

    if (raw.relatedRecords) {
        out.records = raw.relatedRecords;
    }
    if (raw.relatedRecordLabels) {
        out.records = raw.relatedRecordLabels;
    }
    
    if (raw.relatedHelperSetItems) {
        out.helperSets = raw.relatedHelperSetItems;
    }

    // TODO labelize neetds to account for language
    // in crts and helperSetItems
    if (labelize) {
        // FIXME: depth === 3
        var flat = flatten(out, { maxDepth: 3 });
        out = unflatten(
            Object.keys(flat).reduce((acc, key) => {
                if (key.split('.').length < 3) {
                    return acc;
                }

                var value = flat[key];
                if (
                    key.startsWith('crts')
                    || key.startsWith('helperSets')
                ) {
                    value = value.state.label
                }
                else if (key.startsWith('records')) {
                    value = value._recordLabel;
                }

                return { ...acc, [key]: value }
            }, {})
        );
    }

    return (
        isResponse
        ? { ...raw, related: out }
        : out
    );
}

module.exports = fixRelated;
