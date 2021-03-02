'use strict';
var {
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
} = require('../collection/external-organization/');

var instructions = {
    location: {
        default: ({ type, customStateSchema }) => ({
            state: GenericLocationState({ type, customStateSchema })
        }),
        /*children: {
            building: {
                default: ({ record }) => ({
                    state: BuildingState(record.state)
                })
            },
            room: {
                default: ({ record }) => ({
                    state: RoomState(record.state)
                }),
            }
        }*/
    },
    
    subject: {
        default: ({ type, customStateSchema }) => ({
            scientific: {
                state: SubjectScientificState({ type, customStateSchema})
            },
            gdpr: {
                state: SubjectGdprState({ type, customStateSchema })
            }
        })
    },

    externalPerson: {
        default: ({ record }) => ({
            scientific: {
                state: ExternalPersonScientificState(record.state)
            },
            gdpr: {
                state: ExternalPersonGdprState(record.state)
            }
        })
    },

    externalOrganization: {
        default: ({ record }) => ({
            state: ExternalOrganizationState(record.state)
        })
    },

}

module.exports = instructions;
