'use strict';

var createBuildingState = require('./create-building-state'),
    createBuildingBaseRecord = require('./create-building-baserecord'),
    createRoomState = require('./create-room-state'),
    createRoomBaseRecord = require('./create-room-baserecord'),
    createGenericLocationState = require('./create-generic-location-state'),
    createGenericLocationBaseRecord = require('./create-generic-location-baserecord');

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
                baserecord: createBuildingBaseRecord(key, schema)
            }
        }),
        {}
    );

    var roomSchemas = customRoomItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createRoomState(key, schema),
                baserecord: createRoomBaseRecord(key, schema)
            }
        }),
        {}
    );

    var genericLocationSchemas = customGenericLocationItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createGenericLocationState(key, schema),
                baserecord: createGenericLocationBaseRecord(key, schema)
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
