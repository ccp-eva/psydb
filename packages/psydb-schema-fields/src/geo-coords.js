'use strict';
var ExactObject = require('./exact-object');

var GeoCoords = ({
    required,
    ...additionalKeywords
} = {}) => {
    required = required || [
        'latitude',
        'longitude'
    ];

    return ExactObject({
        sytemType: 'GeoCoords',
        title: 'Geo-Koordinaten',
        properties: {
            latitude: {
                title: 'Breitengrad',
                type: 'number',
                minimum: -90,
                maximum: 90
            },
            longitude: {
                title: 'Längengrad',
                type: 'number',
                minimum: -180,
                maximum: 180
            }
        },
        required,
    })
}

module.exports = GeoCoords;
