import jsonpointer from 'jsonpointer';
import stringifyFieldValue from './stringify-field-value';

const createStringifier = ({
    record,
    relatedRecords, // FIXME,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    relatedCustomRecordTypes, // FIXME
}) => {
    if (relatedRecords) {
        relatedRecordLabels = relatedRecords; // FIXME
    }
    if (relatedCustomRecordTypes) {
        relatedCustomRecordTypeLabels = relatedCustomRecordTypes;
    }

    return ({ ptr, type, collection, setId }) => {
        var rawValue = jsonpointer.get(record, ptr);
        var fieldDefinition = {
            type,
            props: { collection, setId }
        };
        return stringifyFieldValue({
            rawValue,
            fieldDefinition,
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        })
    }
}

export default createStringifier;
