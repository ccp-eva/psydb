// TODO: fix the underlying code

const fixRelated = (raw, options = {}) => {
    var { isResponse = true } = options;

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

    return (
        isResponse
        ? { ...raw, related: out }
        : out
    );
}

export default fixRelated;
