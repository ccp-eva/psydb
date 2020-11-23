'use strict';

var createAnimalState = require('./create-animal-state'),
    createAnimalBaseRecord = require('./create-animal-baserecord'),
    createHumanState = require('./create-human-state'),
    createHumanBaseRecord = require('./create-human-baserecord');

var createAllSchemas = ({
    customAnimalGdprItems,
    customHumanGdprItems
}) => {

    var animalSchemas = customAnimalGdprItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createAnimalState(key, schema),
                baserecord: createAnimalBaseRecord(key, schema)
            }
        }),
        {}
    );

    var humanSchemas = customHumanGdprItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createHumanState(key, schema),
                baserecord: createHumanBaseRecord(key, schema)
            }
        }),
        {}
    );

    var schemas = {
        animal: animalSchemas,
        human: humanSchemas
    }

    return schemas;
}

module.exports = createAllSchemas;
