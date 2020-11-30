'use strict';
var FieldAccessMap = require('./field-access-map');

var CombinedTypePermissions = ({
    scientificStateItems,
    gdprStateItems,
} = {}) => {

    var combined = Object.keys(scientificStateItems).reduce(
        (acc, key) => {
            var scientificSchema = scientificStateItems[key],
                gdprSchema = gdprStateItems[key];

            var scientificFieldAccess = FieldAccessMap({
                schema: scientificSchema,
            });

            var gdprFieldAccess = (
                gdprSchema
                ? (
                    FieldAccessMap({
                        schema: gdprSchema
                    })
                )
                : undefined
            );

            return ({
                ...acc,
                [key]: (
                    gdprFieldAccess
                    ? ({
                        type: 'object',
                        properties: {
                            scientific: scientificFieldAccess,
                            gdpr: gdprFieldAccess
                        },
                        required: [
                            'scientific',
                            'gdpr'
                        ]
                    })
                    : ({
                        type: 'object',
                        properties: {
                            scientific: scientificFieldAccess,
                        },
                        required: [
                            'scientific',
                        ]
                    })
                )
            })
        },
        {}
    );

    return ({
        type: 'object',
        properties: combined,
        required: Object.keys(combined),
    });
}

module.exports = CombinedTypePermissions;
