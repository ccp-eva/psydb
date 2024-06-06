import { useCookies } from 'react-cookie';

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

export default useCookieI18N;
