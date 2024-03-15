'use strict';
var { RemapPairError } = require('../errors');
var { lc, justremap } = require('./helpers');

var AdultFields = {
    ...justremap([
        [ 'Nachname', 'gdpr.custom.lastname' ],
        [ 'Vorname', 'gdpr.custom.firstname' ],
        [ 'E-Mail-Adresse', 'gdpr.custom.email' ],
        [ 'Straße', 'gdpr.custom.address.street' ],
        [ 'Hausnummer', 'gdpr.custom.address.housenumber' ],
        [ 'Stadt', 'gdpr.custom.address.city' ],
        [ 'Postleitzahl', 'gdpr.custom.address.postcode' ],
        [ 'Adresszusatz', 'gdpr.custom.address.affix' ],
    ]),
    
    'Sind Sie Mutter oder Vater?': (value) => {
        var mapped = {
            'Mutter': 'female',
            'Vater': 'male',
            'Elternteil': 'other',
        }[value];

        if (!mapped) {
            throw new RemapPairError();
        }

        return { path: 'scientific.custom.gender', value: mapped }
    },

    'Telefonnummer': (value) => ({
        path: 'gdpr.custom.phones', value: [ value ]
    }),
    
    'Auf welchem Weg haben sie von uns erfahren?': (value, extra) => {
        var { acquisitions } = extra;
        var id = acquisitions[lc(value)];
        if (!id) {
            throw new RemapPairError();
        }

        return { path: 'scientific.custom.acquisitionId', value: id }
    }
}

module.exports = AdultFields;
