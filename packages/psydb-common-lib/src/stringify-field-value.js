'use strict';
var stringifiers = require('./field-stringifiers');

var stringifyFieldValue = ({
    rawValue,
    fieldDefinition,

    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,

    record,
    timezone,
    locale,
}) => {

    var {
        type,
        systemType, // FIXME: use this in static declarations
        props,
    } = fieldDefinition;
    
    var str = undefined;
    type = type || systemType; // FIXME

    if (type === 'Lambda') {
        var stringify = stringifiers.Lambda;
        return stringify({
            definition: fieldDefinition,
            record,
            timezone,
            locale
        });
    }

    if (rawValue === undefined) {
        return '-';
    }


    if (type === 'ForeignId') {
        if (rawValue === null) {
            str = '';
        }
        else if (relatedRecordLabels) {
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
        if (rawValue === null) {
            str = '';
        }
        else if (relatedHelperSetItems) {
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
    else if (type === 'CustomRecordTypeKey') {
        if (relatedCustomRecordTypeLabels) {
            str = (
                relatedCustomRecordTypeLabels[props.collection][rawValue].state.label
            );
        }
        else {
            str = rawValue;
        }
    }
    else if (['DateOnlyServerSide', 'DateTime'].includes(type)) {
        var stringify = stringifiers[type];
        str = stringify(rawValue, { timezone, locale });
    }
    else if (type === 'PersonnelResearchGroupSettingsList') {
        if (relatedRecordLabels) {
            str = (rawValue || []).map(it => {
                var { researchGroupId: rgid, systemRoleId: sid } = it;
                var _rel = relatedRecordLabels;
                var rg_label = _rel.researchGroup[rgid]._recordLabel;
                var s_label = _rel.systemRole[sid]._recordLabel;

                return `${rg_label}=${s_label}`;
            }).join();
        }
        else {
            str = (rawValue || []).map(it => (
                `${it.researchGroupId}=${it.systemRoleId}`
            )).join('; ')
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

module.exports = stringifyFieldValue;
