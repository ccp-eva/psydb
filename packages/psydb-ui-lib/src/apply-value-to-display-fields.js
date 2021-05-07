import jsonpointer from 'jsonpointer';
import * as stringifiers from './field-stringifiers'

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

            if (type === 'ForeignId') {
                if (relatedRecordLabels) {
                    str = relatedRecordLabels[props.collection][rawValue]._recordLabel;
                }
                else {
                    str = rawValue;
                }
            }
            else if (type === 'ForeignIdList') {
                console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                console.log(relatedRecordLabels);
                if (relatedRecordLabels) {
                    str = rawValue.map(id => (
                        relatedRecordLabels[props.collection][id]._recordLabel
                    )).join();
                }
                else {
                    str = (rawValue || []).join(', ')
                }
            }
            else if (type === 'HelperSetItemIdList') {
                if (relatedHelperSetItems) {
                    str = rawValue.map(id => (
                        relatedHelperSetItems[props.set][id].state.label
                    )).join();
                }
                else {
                    str = (rawValue || []).join(', ')
                }
            }
            else {
                var stringify = stringifiers[type];
                if (stringify) {
                    str = stringify(rawValue)
                }
                else {
                    str = String(rawValue);
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
