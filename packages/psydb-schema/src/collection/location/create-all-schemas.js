'use strict';

var createBuildingState = require('./create-building-state'),
    createBuildingBaseRecord = require('./create-building-baserecord');

/*
    customBuildingSchemaItems = [
        { key: 'kindergarden', schema: { ... }},
        ...
    ]
*/
var createAllSchemas = ({
    customGenericLocationSchemaItems,
    customBuildingsSchemaItems,
    customRoomsBaseSchemaItems,
}) => {

    var buildingSchemas = customBuildingSchemaItems.reduce(
        ({ key, schema }, acc) => ({
            [key]: {
                state: createBuildingState(key, schema),
                baserecord: createBuildingBaseRecord(key, schema)
            }
        }),
        {}
    );

    var roomSchemas = customRoomSchemaItems.reduce(
        ({ key, schema }, acc) => ({
            [key]: {
                state: createRoomState(key, schema),
                baserecord: createRoomBaseRecord(key, schema)
            }
        }),
        {}
    );

    var genericLocationSchemas = customGenericLocationSchemaItems.reduce(
        ({ kec, schema }, acc) => ({
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
