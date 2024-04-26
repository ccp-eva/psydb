'use strict';
var { enableMigrationMode } = require('@mpieva/psydb-common-config');

var ExactObject = require('./exact-object'),
    SaneString = require('./sane-string');

var Address = (bag = {}) => {
    var {
        required,
        ...additionalProperties
    } = bag;

    //console.log({ enableMigrationMode });
    if (!required) {
        if (enableMigrationMode) {
            required = [];
        }
        else {
            required = [
                bag.isCountryRequired && 'country',
                bag.isCityRequired && 'city',
                bag.isPostcodeRequired && 'postcode',
                bag.isStreetRequired && 'street',
                bag.isHousenumberRequired && 'housenumber',
                bag.isAffixRequired && 'affix'
            ].filter(it => !!it)
        }
    }

    var schema = ExactObject({
        systemType: 'Address',
        required,
        properties: {
            // country should be code from countries-list npm package
            country: {
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Land',
                enum: [ 'DE' ],
                default: 'DE',
            },
            city: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Ort',
                type: 'string',
                default: '',
                ...( !enableMigrationMode && {
                    minLength: required.includes('city') ? 1 : 0,
                })
            }),
            postcode: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'PLZ',
                type: 'string',
                default: '',
                ...( !enableMigrationMode && {
                    minLength: required.includes('postcode') ? 1 : 0,
                })
            }),
            street: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Straße',
                type: 'string',
                default: '',
                ...( !enableMigrationMode && {
                    minLength: required.includes('street') ? 1 : 0,
                }),
                sanitizeGermanStreetSuffix: true
            }),
            housenumber: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Nummer',
                type: 'string',
                default: '',
                ...( !enableMigrationMode && {
                    minLength: required.includes('housenumber') ? 1 : 0,
                })
            }),
            affix: SaneString({
                systemProps: { uiWrapper: 'MultiLineWrapper' },
                title: 'Zusatz',
                type: 'string',
                default: '',
                ...( !enableMigrationMode && {
                    minLength: required.includes('affix') ? 1 : 0,
                })
            }),
        },
        ...additionalProperties,
    });

    return schema;
};

module.exports = Address;
