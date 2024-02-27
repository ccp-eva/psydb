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
        .fixedTypeStateSchemaCreators['apestudies-wkprc-default']
    );

    return Message({
        type: `experiment-variant-setting/apestudies-wkprc-default/create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                studyId: ForeignId({
                    collection: 'study',
                }),
                experimentVariantId: ForeignId({
                    collection: 'experimentVariant',
                    recordType: 'inhouse',
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
