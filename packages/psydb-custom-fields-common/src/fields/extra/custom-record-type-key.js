'use strict';
var { createStringifyValue } = require('../../stringify-utils');

var createQuickSearchSchema = undefined;

var stringifyValue = createStringifyValue({ fn: (bag) => {
    var { definition, value, related, i18n } = bag;
    var { translate, language } = i18n;

    console.log({ definition, value, related });
    var { collection } = definition.props;
    var crt = related.crts?.[collection]?.[value];
    console.log({ crt })
    return crt.state.label; // XXX
    var label = (
        translate.crt(language, crt)
        || '[!!STRINGIFY_ERROR!!]'
    );

    return label;
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
