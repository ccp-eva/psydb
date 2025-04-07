import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';
import { createTranslate } from '@mpieva/psydb-common-translations';

// FIXME: i dont like this beeing here i think
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

const createI18N = (bag) => {
    var { language, localeCode } = bag;

    var locale = localesByCode[localeCode] || enUSLocale;
    var translate = createTranslate(language);
    var timezone = getSystemTimezone();

    return { language, translate, localeCode, locale, timezone }
}

export default createI18N;
