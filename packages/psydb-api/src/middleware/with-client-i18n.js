'use strict';
var enUSLocale = require('date-fns/locale/en-US');
var enGBLocale = require('date-fns/locale/en-GB');
var deLocale = require('date-fns/locale/de');

var localesByCode = [
    enUSLocale,
    enGBLocale,
    deLocale
].reduce((acc, locale) => ({
    ...acc,
    [locale.code]: locale
}), {});

var withClientI18N = () => async (context, next) => {
    var { request, timezone } = context;
    var { language = 'en', locale = 'en-US' } = request.header;
   
    context.language = language;
    context.locale = localesByCode[locale] || enUSLocale;

    context.i18n = { language, locale: context.locale, timezone };

    await next();
}

module.exports = withClientI18N;
