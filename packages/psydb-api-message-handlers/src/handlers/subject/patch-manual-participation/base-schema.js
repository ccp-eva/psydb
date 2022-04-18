'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    OpenObject,
    StringEnum,
    Id,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    var requiredProps = {
        participationId: Id(),
        labProcedureType: StringEnum(
            enums.experimentVariants.keys
        ),
    };
    var requiredKeys = Object.keys(requiredProps);
    
    return Message({
        type: `subject/patch-manual-participation`,
        payload: OpenObject({
            properties: {
                ...requiredProps,
            },
            required: [
                ...requiredKeys,
            ],
        }),
    });
}

module.exports = Schema;
