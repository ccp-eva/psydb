'use strict';
var debug = require('debug')('psydb:humankind-cronjobs:remapMailData');

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
        var childBlockFirstKey = undefined;
        var childBlockData = undefined;
        for (var [ ix, pair ] of pairs.entries()) {
            //console.log({ ix, pair });
            if ([
                'Datenschspeicherung',
                'Datenschutz',
                'Captcha'
            ].includes(pair.key)) {
                continue;
            }

            if (/Wieviele Kinder/.test(pair.key)) {
                inAdultBlock = false;
                childBlockFirstKey = pairs[ix + 1].key;
                debug({ childBlockFirstKey });
                continue;
            }
            else {
                debug(`raw pair is "${pair.key}" = "${pair.value}"`);

                if (pair.key === childBlockFirstKey) {
                    debug("\n", 'found child block at', pair,)
                    if (childBlockData) {
                        childrenData.push(childBlockData);
                    }
                    childBlockData = {};
                }

                var handler, targetBucket;
                if (inAdultBlock || /Auf welchem/.test(pair.key)) {
                    handler = AdultFields[pair.key];
                    targetBucket = adultData;
                }
                else {
                    handler = ChildFields[pair.key];
                    targetBucket = childBlockData;
                }
                
                if (!handler) {
                    throw new RemapMailError({ pair });
                }
                var path, value;
                try {
                    ({ path, value } = handler(
                        sane(pair.value),
                        { languages, acquisitions }
                    ));
                    debug(`   remapped: "${path}" = "${value}"`);
                } catch (e) {
                    throw new RemapMailError({ pair });
                }
                if (!path || !value) {
                    throw new RemapMailError({ pair });
                }
                targetBucket[path] = value;
            }
        }

        if (childBlockData) {
            childrenData.push(childBlockData);
        }
        console.log(adultData);
        console.log(childrenData);
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
        var [ y, m, d] = (
            value.split(/\./g).map((it) => parseInt(it)).reverse()
        );

        var date = new Date(0);
        date.setUTCFullYear(y);
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
        var { languages } = extra;
        var items = value.split(/,\s*/g).filter(it => (
            !!it && it !== 'Keine'
        ));

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
        var { languages } = extra;
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

class RemapMailError extends Error {
    constructor (bag) {
        var { pair } = bag;
        var message = `Cannot Remap Pair "${pair.key}=${pair.value}"`
        super(message);
        this.name = 'RemapMailError';
    }
}

module.exports = remapMailData;
