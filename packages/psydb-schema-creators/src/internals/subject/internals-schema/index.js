'use strict';
var {
    ExactObject,
    ForeignId,
    DateTime,
    ParticipationStatus,
    InvitationStatus,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    ManualParticipation,
    OnlineParticipation,
    ExperimentParticipation
} = require('./participation-variants');

var ExperimentInvitation = require('./experiment-invitation');

var InternalsSchema = () => {
    var required = {
        'isRemoved': DefaultBool(),
        // FIXME: this should actually be scheduledForExperiments
        // since it probably inludes away team based testing as well
        // im not sure about that though (online has to be handled
        // differently i guess cuz that are too many)
        'invitedForExperiments': DefaultArray({
            items: OneOf({ lazyResolveProp: 'type', branches: [
                ExperimentInvitation({ type: 'inhouse' }),
                // TODO: should that be stored?
                ExperimentInvitation({ type: 'away-team' }),
            ]})
        }),
        'participatedInStudies': DefaultArray({
            items: OneOf({ lazyResolveProp: 'type', branches: [
                ManualParticipation(),
                OnlineParticipation(),
                ExperimentParticipation({ type: 'inhouse' }),
                ExperimentParticipation({ type: 'away-team' }),
            ]})
        }),
    }

    var schema = (
        ExactObject({
            properties: { ...required },
            required: Object.keys(required),
        })
    );

    return schema;
}

// FIXME: not sure of that already exists
var LazyOneOf = (bag) => {
    var { lazyResolveProp, branches } = bag;

    var schema = {
        type: 'object',
        lazyResolveProp: 'type',
        oneOf: branches
    }

    return schema;
}

module.exports = InternalsSchema;
