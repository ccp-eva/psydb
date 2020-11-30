'use strict';
var PersonnelScientificState = require('./personnel-scientific-state'),
    PersonnelGdprState = require('./personnel-gdpr-state');

var entityConstructionData = {
    hasCustomTypes: true,
    hasCustomFields: true,
    canHaveGdprPortion: true,

    createCustomTypeScientificSchemas: ({ type }) => ({
        state: PersonnelScientificState({ type }),
    }),
    createCustomTypeGdprSchemas: ({ type }) => ({
        state: PersonnelGdprState({ type }),
    }),
}

module.exports = entityConstructionData;
