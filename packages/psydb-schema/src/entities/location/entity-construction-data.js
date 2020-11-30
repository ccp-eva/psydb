'use strict';
var GenericLocationState = require('./generic-location-state'),
    BuildingState = require('./building-state'),
    RoomState = require('./room-state');

var entityConstructionData = {
    hasCustomTypes: true,
    hasCustomFields: true,

    canHaveGdprPortion: false,

    createCustomTypeSchemas: ({ type }) => ({
        state: GenericLocationState({ type }),
    }),

    fixedTypes: {
        building: {
            hasCustomSubtypes: true,
            createSchemas: ({ type, subtype }) => ({
                state: BuildingState({ subtype })
            }),
        },
        room: {
            hasCustomSubtypes: true,
            createSchemas: ({ type, subtype }) => ({
                state: RoomState({ subtype })
            }),
        },
    },
};

module.exports = entityConstructionData;
