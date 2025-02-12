'use strict';
// FIXME: this should be moved to an extra-fields package
// or, alternatively this paackage should be named data-fields
var { createStringifyValue } = require('../../stringify-utils');
var ForeignId = require('../foreign-id');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related, i18n } = bag;

    var labels = [];
    for (var it of value) {
        var researchGroupLabel = ForeignId.stringifyValue({
            ...bag,
            value: it.researchGroupId,
            definition: { props: { collection: 'researchGroup' }}
        });
        var systemRoleLabel = ForeignId.stringifyValue({
            ...bag,
            value: it.systemRoleId,
            definition: { props: { collection: 'systemRole' }}
        });
        
        labels.push(`${researchGroupLabel}=${systemRoleLabel}`);
    }

    return labels.join('; ');
}});

module.exports = {
    canBeCustomField: false,
    canBeDisplayField: true,
    
    canBeLabelToken: false, // XXX ??
    canBeLabelField: false, // XXX ??

    canSearch: false, // FIXME: rename: canQuickSearch
    
    createQuickSearchSchema,
    stringifyValue,
}
