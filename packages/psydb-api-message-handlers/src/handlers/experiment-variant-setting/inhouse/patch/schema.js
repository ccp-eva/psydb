'use strict';
var {
    ExactObject,
    ForeignId,
    Id,
    EventId,
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
        .fixedTypeStateSchemaCreators['inhouse']
    );

    return Message({
        type: `experiment-variant-setting/inhouse/patch`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                props: StateCreator(),
            },
            required: [
                'id',
                'props'
            ]
        })
    });
}

module.exports = createSchema;
