import { useCookies } from 'react-cookie';

// FIXME: i dont like this beeing here i think; want to put it into hooks
import enUSLocale from 'date-fns/locale/en-US';
import enGBLocale from 'date-fns/locale/en-GB';
import deLocale from 'date-fns/locale/de';

const localesByCode = [
    enUSLocale,
    enGBLocale,
    deLocale
].reduce((acc, locale) => ({
    ...acc,
    [locale.code]: locale
}), {});
//////////////

const useCookieI18N = (bag) => {
    var { config } = bag;
    var [ cookies, setCookie ] = useCookies([ 'i18n' ]);

    var setCookieI18N = (value) => {
        var [ language, localeCode ] = (
            typeof value === 'string'
            ? [ value, (value === 'de' ? deLocale.code : enUSLocale.code) ]
            : [ value.language, value.localeCode ]
        )
        setCookie('i18n', { language, localeCode });
    }

    var { language, localeCode } = getMergedI18N({ cookies, config });
    var locale = localesByCode[localeCode];

    return [
        { language, localeCode, locale },
        setCookieI18N
    ];
}

const getMergedI18N = (bag) => {
    var { cookies, config } = bag;
    var {
        enableI18NSelect,
        defaultLanguage,
        defaultLocaleCode
    } = config.i18n;

    if (enableI18NSelect) {
        var { i18n = {}} = cookies;
        var {
            language = defaultLanguage,
            localeCode = defaultLocaleCode
        } = i18n;
    }
    else {
        var language = defaultLanguage;
        var localeCode = defaultLocaleCode;
    }

    return { language, localeCode };
}

export default useCookieI18N
