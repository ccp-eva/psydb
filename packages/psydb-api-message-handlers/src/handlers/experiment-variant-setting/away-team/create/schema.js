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
        .fixedTypeStateSchemaCreators['away-team']
    );

    return Message({
        type: `experiment-variant-setting/away-team/create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                studyId: ForeignId({
                    collection: 'study',
                }),
                experimentVariantId: ForeignId({
                    collection: 'experimentVariant',
                    recordType: 'away-team',
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
