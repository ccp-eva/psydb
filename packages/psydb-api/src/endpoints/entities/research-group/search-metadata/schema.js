'use strict';
var {
    ExactObject,
    DefaultArray,
    IdList,
    CustomRecordTypeKey,
    LabMethodKey,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var filters = ExactObject({
        properties: {
            researchGroupIds: IdList(),

            labMethods: DefaultArray({
                items: LabMethodKey()
            }),
            studyTypes: DefaultArray({
                items: CustomRecordTypeKey({ collection: 'study' }),
            }),
            subjectTypes: DefaultArray({
                items: CustomRecordTypeKey({ collection: 'subject' }),
            }),
            locationTypes: DefaultArray({
                items: CustomRecordTypeKey({ collection: 'location' }),
            }),
        }
    });

    var projectedFields = DefaultArray({
        items: StringEnum([
            'labMethods', 'studyTypes', 'subjectTypes', 'locationTypes'
        ])
    })

    var schema = ExactObject({
        properties: { filters, projectedFields },
    });

    return schema;
}

module.exports = Schema;
