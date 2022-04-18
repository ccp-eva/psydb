'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var {
    OpenObject,
    StringEnum,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    // TODO: this variant breaks when unmarshalling
    // as it tries to apply date format on second branch when
    // the value is already a date
    var requiredProps = {
        labProcedureType: StringEnum(
            enums.experimentVariants.keys
        ),
    };
    var requiredKeys = Object.keys(requiredProps);
    
    return Message({
        type: `subject/add-manual-participation`,
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
