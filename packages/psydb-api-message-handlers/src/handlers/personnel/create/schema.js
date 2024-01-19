'use strict';
var {
    ClosedObject,
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

    var schema = ClosedObject({
        props: ClosedObject({
            gdpr: GdprState(),
            scientific: ScientificState({ extraOptions: {
                enableCanLogIn: canAllowLogin,
                enableHasRootAccess: isRoot,
            }}),
        }),
    });
    return schema;
}

module.exports = Schema;
