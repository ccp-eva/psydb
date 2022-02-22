'use strict';

var {
    ExactObject,
    DefaultArray,
    StringEnum,
    CustomRecordTypeKey,
    ExperimentVariantEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ({
    oneOf: [
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                target: StringEnum([ 'table', 'optionlist' ]),
                filters: {
                    type: 'object',
                    // TODO
                },
            },
            required: [
                'studyRecordType',
            ]
        }),
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                // FIXME: this is actually labProcedureType
                experimentType: ExperimentVariantEnum(),
                target: StringEnum([ 'table', 'optionlist' ]),
                filters: {
                    type: 'object',
                    // TODO
                },
            },
            required: [
                'studyRecordType',
                'experimentType',
            ]
        }),
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                // FIXME: this is actually labProcedureTypes
                experimentTypes: DefaultArray({
                    items: ExperimentVariantEnum(),
                    minItems: 1
                }),
                target: StringEnum([ 'table', 'optionlist' ]),
                filters: {
                    type: 'object',
                    // TODO
                },
            },
            required: [
                'studyRecordType',
                'experimentTypes',
            ]
        }),
    ]
});

module.exports = RequestBodySchema;
