import * as stringifiers from './field-stringifiers'

const stringifyFieldValue = ({
    rawValue,
    fieldDefinition,

    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => {

    if (rawValue === undefined) {
        return '-';
    }

    var {
        type,
        props,
    } = fieldDefinition;

    var str = undefined;

    if (type === 'ForeignId') {
        if (relatedRecordLabels) {
            str = (
                relatedRecordLabels[props.collection][rawValue]._recordLabel
            );
        }
        else {
            str = rawValue;
        }
    }
    else if (type === 'ForeignIdList') {
        if (relatedRecordLabels) {
            str = (rawValue || []).map(id => (
                relatedRecordLabels[props.collection][id]._recordLabel
            )).join();
        }
        else {
            str = (rawValue || []).join(', ')
        }
    }
    else if (type === 'HelperSetItemId') {
        if (relatedHelperSetItems) {
            str = (
                relatedHelperSetItems[props.setId][rawValue].state.label
            );
        }
        else {
            str = rawValue;
        }
    }
    else if (type === 'HelperSetItemIdList') {
        if (relatedHelperSetItems) {
            str = (rawValue || []).map(id => (
                relatedHelperSetItems[props.setId][id].state.label
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

    return str;
}

export default stringifyFieldValue;
