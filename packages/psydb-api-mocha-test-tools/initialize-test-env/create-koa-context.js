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

var createKoaContext = function (extraContext) {
    var {
        client, dbName, dbHandle,
        i18n = { language: 'en', locale: 'de', timezone: 'Europe/Berlin'}
    } = this.getMongoContext();

    i18n = { ...i18n, locale: localesByCode[i18n.locale] };

    var koaContext = {
        mongoClient: client,
        mongoDbName: dbName,
        db: dbHandle,
        i18n,

        session: { personnelId: 1234 },
        self: { personnelId: 1234 },
        permissions: { isRoot: true },
        request: {},
        response: {},
        ip: '127.0.0.1'
    }
    return { ...koaContext, ...extraContext };
}
module.exports = createKoaContext;
