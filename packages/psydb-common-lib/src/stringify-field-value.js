'use strict';
var { __fixRelated } = require('@mpieva/psydb-common-compat');
var stringifiers = require('./field-stringifiers');

var stringifyFieldValue = ({
    rawValue,
    fieldDefinition,

    related,
    relatedRecordLabels, // FIXME
    relatedHelperSetItems, // FIXME
    relatedCustomRecordTypeLabels, // FIXME

    record,

    language,
    locale,
    timezone,
}) => {

    if (!related) {
        related = __fixRelated({
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        }, { isResponse: false })
    }

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
                relatedRecordLabels[props.collection][rawValue]?._recordLabel
                || rawValue
            );
        }
        else {
            str = rawValue;
        }
    }
    else if (type === 'ForeignIdList') {
        if (relatedRecordLabels) {
            str = (rawValue || []).map(id => {
                var item = relatedRecordLabels[props.collection][id];
                return item?._recordLabel || `[${id}]`
            }).join();
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
            var relatedItem = related.helperSets[props.setId][rawValue];
            str = (
                (relatedItem.state.displayNameI18N || {})[language]
                || relatedItem.state.label
            );
        }
        else {
            str = rawValue;
        }
    }
    else if (type === 'HelperSetItemIdList') {
        if (relatedHelperSetItems) {
            str = (rawValue || []).map(id => {
                var relatedItem = related.helperSets[props.setId][id];
                return (
                    (relatedItem.state.displayNameI18N || {})[language]
                    || relatedItem.state.label
                );
            }).join('; ');
        }
        else {
            str = (rawValue || []).join('; ')
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
            }).join('; ');
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
            str = stringify(rawValue, { language })
        }
        else {
            str = String(rawValue);
        }
    }

    return str;
}

module.exports = stringifyFieldValue;
