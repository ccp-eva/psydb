'use strict';

var {
    ExactObject,
    DefaultArray,
    StringEnum,
    CustomRecordTypeKey,
    ExperimentVariantEnum,
} = require('@mpieva/psydb-schema-fields');

var Filters = () => ({ type: 'object' /* TODO */ });

var RequestBodySchema = () => ({
    // NOTE oneOf because of array/scalar mix in experimentTypes i guess?
    oneOf: [
        ExactObject({
            properties: {
                studyRecordType: CustomRecordTypeKey({ collection: 'study' }),
                target: StringEnum([ 'table', 'optionlist' ]),
                filters: Filters(),
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
                filters: Filters(),
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
                filters: Filters(),
            },
            required: [
                'studyRecordType',
                'experimentTypes',
            ]
        }),
    ]
});

module.exports = RequestBodySchema;
