'use strict';
var { ClosedObject, DefaultArray } = require('../core-composition');
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
        return ClosedObject({
            'affix': AnyString({ anonT: `${anonTPrefix}.affix` }),
            'city': AnyString({ anonT: `${anonTPrefix}.city` }),
            'housenumber': AnyString({ anonT: `${anonTPrefix}.number` }),
            'street': AnyString({ anonT: `${anonTPrefix}.street` }),
            'postcode': AnyString({ anonT: `${anonTPrefix}.zip` }),

            ...(enableCountry && {
                'country': AnyString({ anonT: `${anonTPrefix}.country` }),
            }),

            ...extraProps
        })
    }
    else {
        return ClosedObject({
            'affix': AnyString(),
            'city': AnyString(),
            'housenumber': AnyString(),
            'street': AnyString(),
            'postcode': AnyString(),

            ...(enableCountry && {
                'country': AnyString(),
            }),

            ...extraProps
        })
    }
}

module.exports = Address;
