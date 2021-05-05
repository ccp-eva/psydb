import jsonpointer from 'jsonpointer';

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

            var str = rawValue;
            if (relatedRecordLabels) {
                if (type === 'ForeignId') {
                    str = relatedRecordLabels[props.collection][rawValue]._recordLabel;
                }
                else if (type === 'ForeignIdList') {
                    str = rawValue.map(id => (
                        relatedRecordLabels[props.collection][id]._recordLabel
                    )).join();
                }
            }

            // TODO use stringifiers from common
            return {
                ...it,
                value: str
            }
        })
    )
}

export default applyValueToDisplayFields;
