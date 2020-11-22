'use strict';
var location = require('./location/create-all-schemas');

var createAllCollectionSchemas = ({
    customGenericLocationBaseRecords,
    customBuildingsBaseRecords,
    customRoomsBaseRecords,

    //CustomSubjectSientifics,
    //CustomSubjectGDPRs
}) => ({
    // collection
    /*location: {
        // combined type
        gps: {
            state: {},
            baserecord: {}
        },
        kindergarden: {
            state: {},
            baserecord: {},
        }
    },*/
    location: location.createAllSchemas({
        customGenericLocationsBaseRecords,
        customBuildingsBaseRecords,
        customRoomsBaseRecords,
    }),
})
