'use strict';
var { ucfirst, pathify, entries } = require('@mpieva/psydb-core-utils');
var { faker } = require('./externals');

var randInt = (bag) => faker.number.int(bag);
var strRandInt = (bag) => String(randInt(bag));

var xxxify = (str) => (
    str + 'xxxxxx_' + faker.number.int({ min: 10, max: 99 })
);
var emailify = (str) => (
    (str + '_fake@example.com').replace(/\s/g,'_')
);

var address = ({ path, affix, country }) => (
    pathify({
        'affix': affix,
        'number': String(faker.number.int({ min: 1, max: 200 })),
        'street': faker.location.street(),
        'zip': String(faker.number.int({ min: 10000, max: 99999 })),
        'city': faker.location.city(),
        ...(country && {
            'country': country
        }),
    }, { prefix: path })
);

var sentence = () => (
    faker.lorem.sentence()
)

var text = (sentences = 3, sep = "\n") => (
    faker.lorem.sentences(sentences, sep)
)

var dateOfBirth = () => {
    var d = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    d.setUTCHours(12, 0, 0, 0);
    return d;
}

var noun = (affix, seperator = ' ') => (
    [
        ucfirst(faker.word.noun()),
        ...(affix ? [ affix ]: [])
    ].join(seperator)
)

var strnum = (formatOrOptions) => (
    typeof formatOrOptions === 'string'
    ? faker.phone.number(formatOrOptions)
    : String(faker.number.int(formatOrOptions))
)

var ucchars = (n) => faker.string.alpha({ length: n, casing: 'upper' });

var isAbbreviation = (str) => str === str.toUpperCase()
var toLowerCase = (str) => str.toLowerCase()
var not = (lambda) => (...args) => !lambda(...args)
var isFirstCharEqual = (a) => (b) => (
    a[0].toLowerCase() === b[0].toLowerCase()
)

var getRandomListItem = (list) => {
    var ix = faker.number.int({ min: 0, max: list.length - 1 });
    var item = list[ix];
    return item
}

// see https://stackoverflow.com/a/37511463
var convertDiacriticsAndStuff = (str) => (
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
)

var firstname = (str) => {
    if (!str) {
        return str;
    }

    str = convertDiacriticsAndStuff(str);

    var defs = faker.definitions;
    var list = [
        ...defs.company.buzz_adjective,
        ...defs.company.adjective,
        ...defs.word.adjective,
        'xoxo',
    ];

    list = (
        list
        .filter(not(isAbbreviation))
        .map(toLowerCase)
        .filter(isFirstCharEqual(str))
    );
    if (list.length === 0) {
        console.log(str);
    }

    return ucfirst(getRandomListItem(list));
}

var lastname = (str) => {
    if (!str) {
        return str;
    }

    str = convertDiacriticsAndStuff(str);

    var defs = faker.definitions;
    var list = [
        ...defs.company.buzz_noun,
        ...defs.company.noun,
        ...defs.word.noun,
        'xoxo',
    ];

    list = (
        list
        .filter(not(isAbbreviation))
        .map(toLowerCase)
        .filter(isFirstCharEqual(str))
    );
    if (list.length === 0) {
        console.log(str);
    }

    return (
        ucfirst(getRandomListItem(list))
        + '' + faker.number.int({ min: 10, max: 99 })
    )
}

module.exports = {
    ucfirst,
    getRandomListItem,

    randInt,
    strRandInt,

    xxxify,
    emailify,
    
    firstname,
    lastname,

    address,
    noun,
    sentence,
    text,
    strnum,
    ucchars,
    dateOfBirth,

    ObjectId: faker.database.mongodbObjectId,
}
