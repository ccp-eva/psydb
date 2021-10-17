'use strict';
var {
    ExactObject,
    ForeignId,
    Id,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var {
    experimentVariantSetting
} = require('@mpieva/psydb-schema-creators')

var createSchema = ({} = {}) => {
    var StateCreator = (
        experimentVariantSetting
        .fixedTypeStateSchemaCreators['online-survey']
    );

    return Message({
        type: `experiment-variant-setting/online-survey/create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                studyId: ForeignId({
                    collection: 'study',
                }),
                experimentVariantId: ForeignId({
                    collection: 'experimentVariant',
                    recordType: 'online-survey',
                }),
                props: StateCreator(),
            },
            required: [
                'studyId',
                'experimentVariantId',
                'props'
            ]
        })
    });
}

module.exports = createSchema;
