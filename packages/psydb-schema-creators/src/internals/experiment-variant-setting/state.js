'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    Id,
    ForeignId,
    DateTimeInterval,
    ParticipationStatus,
    InvitationStatus,
    DefaultBool,
    FullText,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

// TODO: merge adjascent reservations into one? or have a handler?
var ExperimentState = ({
    enableInternalProps
} = {}) => {
    var schema = {
        type: 'object',
        lazyResolveProp: 'variant',
        oneOf: [
        ]
    }

    return schema;
}

var OnlineSurveyVariant = () => {
    return ExactObject({
        properties: {
            variant: VariantEnum({ const: 'online-survey' }),
            subjectTypeSettings: DefaultArray({
                items: ExactObject({
                    properties: {
                        typeKey: CustomRecordTypeKey({
                            collection: 'subject',
                        }),
                    },
                    required: [
                        'subjectType'
                    ]
                })
            })
        },
        required: [
            'variant',
            'subjectTypeSettings',
        ]
    });
}

var OnlineVideoCallVariant = () => {
    return ExactObject({
        properties: {
            variant: VariantEnum({ const: 'online-video-call' }),
            subjectTypeSettings: DefaultArray({
                items: ExactObject({
                    properties: {
                        typeKey: CustomRecordTypeKey({
                            title: 'Proband:innentyp',
                            collection: 'subject',
                        }),
                        subjectsPerExperiment: Integer({
                            title: 'Proband:innen pro Experiment',
                            default: 1,
                            minimum: 1,
                        }),
                        subjectEqualityInFields: DefaultArray({
                            // this has to be checked later on
                            // in the message handler
                            items: JsonPointer(),
                        })
                    },
                    required: [
                        'subjectType',
                        'subjectsPerExperiment',
                        'subjectEqualityInFields',
                    ]
                })
            })
        },
        required: [
            'variant',
            'subjectTypeSettings',
        ]
    });
}

var VariantEnum = (additionalKeywords) => {
    return StringEnum([
        'online-survey',
        'online-video-call',
        'inhouse-experiment',
        'away-team-experiment',
    ], additionalKeywords)
}

module.exports = ExperimentState;

