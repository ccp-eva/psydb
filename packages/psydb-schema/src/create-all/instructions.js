'use strict';
/*var {
    GenericLocationState,
    BuildingState,
    RoomState,
} = require('../collection/location/');

var {
    SubjectScientificState,
    SubjectGdprState,
} = require('../collection/subject/');

var {
    ExternalPersonScientificState,
    ExternalPersonGdprState,
} = require('../collection/external-person/');

var {
    ExternalOrganizationState,
} = require('../collection/external-organization/');*/

var internals = require('../collection/');

var instructions = {
    location: {
        default: ({ type, customStateSchema }) => ({
            state: internals.LocationState({ type, customStateSchema })
        }),
    },
    
    subject: {
        default: ({ type, customStateSchema }) => ({
            scientific: {
                state: internals.SubjectScientificState({ type, customStateSchema})
            },
            gdpr: {
                state: internals.SubjectGdprState({ type, customStateSchema })
            }
        })
    },

    externalPerson: {
        default: ({ record }) => ({
            scientific: {
                state: internals.ExternalPersonScientificState(record.state)
            },
            gdpr: {
                state: internals.ExternalPersonGdprState(record.state)
            }
        })
    },

    externalOrganization: {
        default: ({ record }) => ({
            state: internals.ExternalOrganizationState(record.state)
        })
    },

    study: {
        default: ({ type, customStateSchema }) => ({
            state: internals.StudyState({ type, customStateSchema })
        })
    },

}

module.exports = instructions;
