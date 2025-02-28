'use strict';
var {
    ExactObject,
    DefaultArray,
    ForeignId,
    ForeignIdList,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var {
    ManualParticipation,
    OnlineParticipation,
    ExperimentParticipation
} = require('./participation-variants');

var ExperimentInvitation = require('./experiment-invitation');
var MergedDuplicatesList = require('./merged-duplicates-list');

var InternalsSchema = () => {
    var required = {
        'isRemoved': DefaultBool(),
        // FIXME: this should actually be scheduledForExperiments
        // since it probably inludes away team based testing as well
        // im not sure about that though (online has to be handled
        // differently i guess cuz that are too many)
        'invitedForExperiments': DefaultArray({
            items: LazyOneOf({ lazyResolveProp: 'type', branches: [
                ExperimentInvitation({ type: 'inhouse' }),
                // TODO: should that be stored?
                ExperimentInvitation({ type: 'away-team' }),
            ]})
        }),
        'participatedInStudies': DefaultArray({
            items: LazyOneOf({ lazyResolveProp: 'type', branches: [
                ManualParticipation(),
                OnlineParticipation(),
                ExperimentParticipation({ type: 'inhouse' }),
                ExperimentParticipation({ type: 'away-team' }),
            ]})
        }),

        'mergedDuplicates': MergedDuplicatesList(),
        'nonDuplicateIds': ForeignIdList({ collection: 'subject' })
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
        lazyResolveProp,
        oneOf: branches
    }

    return schema;
}

module.exports = InternalsSchema;
