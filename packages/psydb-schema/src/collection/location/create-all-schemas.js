'use strict';

var createBuildingState = require('./create-building-state'),
    createRoomState = require('./create-room-state'),
    createGenericLocationState = require('./create-generic-location-state');

/*
    customBuildingSchemaItems = [
        { key: 'kindergarden', schema: { ... }},
        ...
    ]
*/
var createAllSchemas = ({
    customGenericLocationItems,
    customBuildingItems,
    customRoomItems,
}) => {

    var buildingSchemas = customBuildingItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createBuildingState(key, schema),
            }
        }),
        {}
    );

    var roomSchemas = customRoomItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createRoomState(key, schema),
            }
        }),
        {}
    );

    var genericLocationSchemas = customGenericLocationItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createGenericLocationState(key, schema),
            }
        }),
        {}
    );

    var schemas = {
        building: buildingSchemas,
        room: roomSchemas,
        ...genericLocationSchemas,
    };

    return schemas;
}

module.exports = createAllSchemas;
