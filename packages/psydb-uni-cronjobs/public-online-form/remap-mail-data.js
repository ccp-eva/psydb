'use strict';

var sane = (v) => String(v).trim();
var lc = (s) => s.toLowerCase();
var justremap = (simpleMap) => simpleMap.reduce((acc, it) => {
    var [ str, path ] = it;
    return { ...acc, [str]: value => ({ path, value })}
}, {});

var remapMailData = async (context, next) => {
    var { mails, languages, acquisitions } = context;

    for (var it of mails) {
        var { seq, pairs } = it;
        
        var adultData = {};
        var childrenData = [];
        
        var inAdultBlock = true;
        var childFirstKey = undefined;
        var childBlockData = {};
        for (var [ ix, pair ] of pairs.entries()) {
            if ([
                'Datenschspeicherung',
                'Datenschutz',
                'Captcha'
            ].includes(pair.key)) {
                continue;
            }

            if (/Wieviele Kinder/.test(pair.key)) {
                inAdultBlock = false;
                childFirstKey = pairs[ix + 1];
                continue;
            }
            else if (inAdultBlock || /Auf welchem/.test(pair.key)) {
                var handler = AdultFields[pair.key];
                if (!handler) {
                    throw new Error(pair.key);
                }
                var { path, value } = handler(
                    sane(pair.value),
                    { languages, acquisitions }
                );
                console.log({ path, value });
                if (!value) {
                    throw new Error(pair.key);
                }
            }
        }
    }

    await next();
}

var AdultFields = {
    ...justremap([
        [ 'Nachname', 'lastname' ],
        [ 'Vorname', 'firstname' ],
        [ 'E-Mail-Adresse', 'email' ],
        [ 'Straße', 'address.street' ],
        [ 'Hausnummer', 'address.housenumber' ],
        [ 'Stadt', 'address.city' ],
        [ 'Postleitzahl', 'address.postcode' ],
        [ 'Adresszusatz', 'address.affix' ],
    ]),
    
    'Sind Sie Mutter oder Vater?': (value) => {
        var mapped = {
            'Mutter': 'f',
            'Vater': 'm'
        }[value];

        if (!mapped) {
            throw new Error();
        }

        return { path: 'gender', value: mapped }
    },

    'Telefonnummer': (value) => ({
        path: 'phones', value: [ value ]
    }),
    
    'Auf welchem Weg haben sie von uns erfahren?': (value, extra) => {
        var { acquisitions } = extra;
        var id = acquisitions[lc(value)];
        if (!id) {
            throw new Error();
        }

        return { path: 'acquisitionId', value: id }
    }
}

var ChildFields = {
    ...justremap([
        [ 'Nachname', 'lastname' ],
        [ 'Vorname', 'firstname' ],
    ]),

    'Geschlecht des Kindes': (value) => {
        var mapped = {
            'weiblich': 'f',
            'männlich': 'm',
            'divers': 'o',
        }[value];
        if (!mapped) {
            throw new Error();
        }
        
        return { path: 'gender', value: mapped }
    },

    'Geburtsdatum': (value) => {
        var [ y, m, d ] = value.split('.').map(parseInt).reverse();

        var date = new Date(0);
        date.setUTCYear(y);
        date.setUTCMonth(m - 1);
        date.setUTCDate(d);

        return { path: 'dateOfBirth', value: date.toISOString() }
    },

    'Muttersprache des Kindes': (value, extra) => {
        var { languages } = extra;
        var id = languages[lc(value)];
        if (!id) {
            throw new Error();
        }

        return { path: 'nativeLanguageId', value: id }
    },
    'andere Muttersprache': (value, extra) => {
        var { languages } = extra;
        var id = languages[lc(value)];
        if (!id) {
            throw new Error();
        }

        return { path: 'nativeLanguageId', value: id }
    },
    'Zweitsprache des Kindes': (value, extra) => {
        var { languageMap } = extra;
        var items = value.split(/,\s*/g).filter(it => !!it);

        var out = [];
        for (var it of items) {
            var id = languages[lc(sane(it))];
            if (!id) {
                throw new Error();
            }
            out.push(id)
        }
        return { path: 'otherLanguageIds', value: out };
    },
    'andere Zweitsprache': (value, extra) => {
        var { languageMap } = extra;
        var items = value.split(/,\s*/g).filter(it => !!it);

        var out = [];
        for (var it of items) {
            var id = languages[lc(sane(it))];
            if (!id) {
                throw new Error();
            }
            out.push(id)
        }
        return { path: 'otherLanguageIds', value: out };
    } 
}

module.exports = remapMailData;
