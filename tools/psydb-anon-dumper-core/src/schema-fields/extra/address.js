'use strict';
var { ExactObject, DefaultArray } = require('../core-composition');
var { AnyString } = require('../scalar');

var Address = (bag = {}) => {
    var {
        enableCountry = true,
        extraProps,
        //useDefaultAnonT = false, // FIXME maybe ???
        anonTPrefix
    } = bag;

    // FIXME: thats ugly
    if (anonTPrefix) {
        return ExactObject({
            'affix': AnyString({ anonT: `${anonTPrefix}.affix` }),
            'city': AnyString({ anonT: `${anonTPrefix}.city` }),
            'number': AnyString({ anonT: `${anonTPrefix}.number` }),
            'street': AnyString({ anonT: `${anonTPrefix}.street` }),
            'zip': AnyString({ anonT: `${anonTPrefix}.zip` }),

            ...(enableCountry && {
                'country': AnyString({ anonT: `${anonTPrefix}.country` }),
            }),

            ...extraProps
        })
    }
    else {
        return ExactObject({
            'affix': AnyString(),
            'city': AnyString(),
            'number': AnyString(),
            'street': AnyString(),
            'zip': AnyString(),

            ...(enableCountry && {
                'country': AnyString(),
            }),

            ...extraProps
        })
    }
}

module.exports = Address;
