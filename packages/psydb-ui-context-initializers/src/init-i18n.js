import * as datefns from 'date-fns';

import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { createTranslate } from '@mpieva/psydb-common-translations';
import { localesByCode, enUSLocale } from '@mpieva/psydb-ui-date-locales';
import { useCookies } from '@mpieva/psydb-ui-cookies';

const initI18N = (bag) => {
    var { config = {} } = bag;

    var [ cookieI18N, setCookieI18N ] = useCookieI18N({ config });
    var { language, localeCode } = cookieI18N;

    var locale = localesByCode[localeCode] || enUSLocale;
    var translate = createTranslate(language);
    var timezone = getSystemTimezone();

    var fdate = (datelike, fmt = 'P') => (
        datelike
        ? datefns.format(new Date(datelike), fmt, { locale })
        : '-'
    );
    var fdatetime = (datelike, fmt = 'P p') => (
        datelike
        ? datefns.format(new Date(datelike), fmt, { locale })
        : '-'
    );

    var i18n = {
        language, translate,
        localeCode, locale, timezone,

        fdate, fdatetime,
    }

    return [ i18n, setCookieI18N ];
}

const useCookieI18N = (bag) => {
    var { config = {} } = bag;

    var cookieID = 'i18n';
    var [ cookies, setCookie ] = useCookies([ cookieID ]);

    var setCookieI18N = (value) => {
        var { language, localeCode } = value;
        if (!localeCode) {
            localeCode = getDefaultLanguageLocaleCode(language)
        }
        setCookie(cookieID, { language, localeCode });
    }

    var { language, localeCode } = getMergedI18N({
        cookie: cookies[cookieID],
        config: config.i18n
    });

    return [
        { language, localeCode },
        setCookieI18N
    ];
}

const getMergedI18N = (bag) => {
    var { cookie = {}, config = {} } = bag;
    var {
        enableI18NSelect,
        defaultLanguage,
        defaultLocaleCode
    } = config;

    if (enableI18NSelect) {
        var {
            language = defaultLanguage,
            localeCode = defaultLocaleCode
        } = cookie;
    }
    else {
        var language = defaultLanguage;
        var localeCode = defaultLocaleCode;
    }

    return { language, localeCode };
}

var getDefaultLanguageLocaleCode = (language) => {
    return ({
        'en': 'en-US',
        'de': 'de' 
    }[language] || 'en-US')
}

export default initI18N;
