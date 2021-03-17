'use strict';
var CustomProps = require('../../common/custom-props');

var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var SubjectGdprState = ({
    enableInternalProps,
    customFieldDefinitions,
} = {}) => {
    var schema = ExactObject({
        properties: {
            custom: CustomProps({ customFieldDefinitions }),
        },
        required: [
            'custom',
        ]
    });

    return schema;
};

module.exports = SubjectGdprState;
