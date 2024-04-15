'use strict';
var {
    ClosedObject,
    ExactObject,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { personnel } = require('@mpieva/psydb-schema-creators');
var {
    gdpr: GdprState,
    scientific: ScientificState
} = personnel.subChannelStateSchemaCreators;

var {
    ApiError,
} = require('@mpieva/psydb-api-lib');

var Schema = async (context) => {
    var { permissions } = context;
    
    var canAllowLogin = permissions.hasFlag('canAllowLogin');
    var isRoot = permissions.isRoot();

    var schema = ExactObject({
        properties: {
            sendMail: DefaultBool(),
            props: ClosedObject({
                gdpr: GdprState(),
                scientific: ScientificState({ extraOptions: {
                    enableCanLogIn: canAllowLogin,
                    enableHasRootAccess: isRoot,
                }}),
            }),
        },
        required: [ 'props' ],
    });
    return schema;
}

module.exports = Schema;
