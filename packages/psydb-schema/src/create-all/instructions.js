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
        default: ({ record }) => ({
            state: GenericLocationState(record.state)
        }),
        children: {
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
        }
    },
    
    subject: {
        default: ({ record }) => ({
            scientific: {
                state: SubjectScientificState(record.state)
            },
            gdpr: {
                state: SubjectGdprState(record.state)
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
