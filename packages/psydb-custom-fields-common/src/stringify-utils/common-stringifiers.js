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
        var { value, i18n: { language }, short = false} = bag;
        return translate(
            language, `${prefix}${value}${short ? '_short' : ''}`
        );
    }});
}

var JustLocaleDate = (options = {}) => {
    var {
        format = 'P p',
        fallbackFormat = 'yyyy-MM-dd HH:mm:ss',
        ...pass
    } = options;

    return createStringifyValue({ ...pass, fn: (bag) => {
        var { value, i18n = {}} = bag;
        var { locale = undefined, timezone = undefined } = i18n;
        
        var _format = format;
        if (!locale) {
            _format = fallbackFormat;
        }

        var d = new Date(value);
        return (
            timezone
            ? formatInTimeZone(d, timezone, _format, { locale })
            : formatDate(d, _format, { locale })
        )
    }});
}

module.exports = {
    JustString,
    JustJoin,
    JustTranslate,
    JustLocaleDate,
}
