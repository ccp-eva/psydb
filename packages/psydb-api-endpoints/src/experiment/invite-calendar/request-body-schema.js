'use strict';
var {
    ExactObject,
    DefaultArray,
    ForeignId,
    ForeignIdList,
    DefaultBool,
    CustomRecordTypeKey,
    DateTimeInterval,
    ExperimentTypeEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        interval: DateTimeInterval(),

        experimentTypes: DefaultArray({
            items: ExperimentTypeEnum(),
            minLength: 1,
        }),
        subjectRecordType: CustomRecordTypeKey({ collection: 'subject' }),
        researchGroupId: ForeignId({ collection: 'researchGroup' }),
        studyId: ForeignId({ collection: 'study' }),
        locationId: ForeignId({ collection: 'location' }),

        experimentOperatorTeamIds: ForeignIdList({
            collection: 'experimentOperatorTeam'
        }),
        showPast: DefaultBool(),
    },
    required: [ 'interval' ]
});

module.exports = RequestBodySchema;
