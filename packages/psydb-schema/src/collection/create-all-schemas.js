'use strict';
var location = require('./location/create-all-schemas');

var createAllCollectionSchemas = ({
    customGenericLocationItems,
    customBuildingItems,
    customRoomItems,

    customAnimalScientificItems,
    customAnimalGdprItems,
    customHumanScientificItems,
    customHumanGdprItems

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
        customGenericLocationItems,
        customBuildingItems,
        customRoomItems,
    }),
})
