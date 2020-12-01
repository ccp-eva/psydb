'use strict';
var SubjectScientificState = require('./subject-scientific-state'),
    SubjectGdprState = require('./subject-gdpr-state');

var entityConstructionData = {
    hasCustomFields: true,
    hasCustomTypes: false,
    hasGdprPortion: true,
    
    fixedTypes: {
        human: {
            hasCustomTypes: true,
            hasCustomFields: true,
            hasGdprProtion: true,

            createCustomScientificSchemas: (...args) => ({
                state: SubjectScientificState(...args),
            }),
            createCustomGdprSchemas: (...args) => ({
                state: SubjectGdprState(...args),
            }),
        },
        animal: {
            hasCustomTypes: true,
            hasCustomFields: true,
            hasGdprProtion: true,

            createCustomScientificSchemas: (...args) => ({
                state: SubjectScientificState(...args),
            }),
            createCustomGdprSchemas: (...args) => ({
                state: SubjectGdprState(...args),
            }),
        },
    },
}

module.exports = entityConstructionData;
