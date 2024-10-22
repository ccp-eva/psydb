'use strict';
var { __maybeUseESM } = require('@mpieva/psydb-common-compat');

var formatDate = __maybeUseESM(require('date-fns/format'));
var { formatInTimeZone } = require('date-fns-tz');

var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { translate } = require('@mpieva/psydb-common-translations');
var createStringifyValue = require('./create-stringify-value');

var JustString = (options = {}) => {
    var { ...pass } = options;
    
    return createStringifyValue({ ...pass, fn: ({ value }) => {
        return String(value);
    }});
}

var JustJoin = (options = {}) => {
    var { sep = ', ', pointer = undefined, ...pass } = options;

    return createStringifyValue({ ...pass, fn: ({ value }) => {
        if (pointer) {
            value = value.map(it => jsonpointer.get(it, pointer));
        }
        return value.join(sep);
    }});
}

var JustTranslate = (options = {}) => {
    var { prefix = '', ...pass } = options;
    
    return createStringifyValue({ ...pass, fn: (bag) => {
        var { value, i18n: { language }} = bag;
        return translate(language, `${prefix}${value}`);
    }});
}

var JustLocaleDate = (options = {}) => {
    var { format = 'P p', ...pass } = options;

    return createStringifyValue({ ...pass, fn: (bag) => {
        var { value, i18n: { locale, timezone = undefined }} = bag;
        
        return (
            timezone
            ? formatInTimeZone(new Date(value), timezone, format, { locale })
            : formatDate(new Date(value), format, { locale })
        )
    }});
}

module.exports = {
    JustString,
    JustJoin,
    JustTranslate,
    JustLocaleDate,
}
