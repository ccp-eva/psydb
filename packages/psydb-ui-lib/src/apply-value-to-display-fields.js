import jsonpointer from 'jsonpointer';
import stringifyFieldValue from './stringify-field-value';

const applyValueToDisplayFields = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
}) => {
    return (
        displayFieldData.map(it => {
            var { key, type, displayName, props, dataPointer } = it;
            var rawValue = jsonpointer.get(record, dataPointer);

            var str = stringifyFieldValue({
                rawValue,
                fieldDefinition: it,
    
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                record,
            });

            return {
                ...it,
                value: str
            }
        })
    )
}

export default applyValueToDisplayFields;
