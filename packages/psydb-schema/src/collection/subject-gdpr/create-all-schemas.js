'use strict';
var createAnimalState = require('./create-animal-state'),
    createHumanState = require('./create-human-state');

var createAllSchemas = ({
    customAnimalGdprItems,
    customHumanGdprItems
}) => {

    var animalSchemas = customAnimalGdprItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createAnimalState(key, schema),
            }
        }),
        {}
    );

    var humanSchemas = customHumanGdprItems.reduce(
        (acc, { key, schema }) => ({
            ...acc,
            [key]: {
                state: createHumanState(key, schema),
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
