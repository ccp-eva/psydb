'use strict';
var SubjectScientificState = require('./subject-scientific-state'),
    SubjectGdprState = require('./subject-gdpr-state');

var entityConstructionData = {
    hasCustomFields: true,
    hasCustomTypes: false,
    
    canHaveGdprPortion: true,
    
    fixedTypes: {
        human: {
            hasCustomSubtypes: true,
            createScientificSchemas: ({ type }) => ({
                state: SubjectScientificState,
            }),
            createGdprSchemas: ({ type }) => ({
                state: SubjectGdprState,
            }),
        },
        animal: {
            hasCustomSubtypes: true,
            createScientificSchemas: ({ type }) => ({
                state: SubjectScientificState,
            }),
            createGdprSchemas: ({ type }) => ({
                state: SubjectGdprState,
            }),
        },
    },
}

module.exports = entityConstructionData;
