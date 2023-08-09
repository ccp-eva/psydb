'use strict';
var ejson = require('@cdxoo/tiny-ejson');
var config = require('@mpieva/psydb-api-config');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var {
    createInitialChannelState,
    pathifyProps,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var GenericRecordHandler = require('../../lib/generic-record-handler');
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages,
} = require('../../lib/generic-record-handler-utils');

module.exports = GenericRecordHandler({
    collection: 'personnel',
    op: 'patch',
    checkSchema: async (context) => {
        var { db, message, permissions } = context;
        var { RecordMessage } = allSchemaCreators['personnel'];

        var canAllowLogin = permissions.hasFlag('canAllowLogin');
        var isRoot = permissions.isRoot();

        var schema = RecordMessage({
            op: 'patch',
            enableCanLogIn: canAllowLogin,
            enableHasRootAccess: isRoot,
        });

        validateOrThrow({
            schema,
            payload: message
        });
    },
    triggerSystemEvents: async (options) => {
        var {
            db, rohrpost, personnelId,
            message, cache, dispatchProps
        } = options;

        var destructured = destructureMessage({ message });

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });
        
        var { props, collection } = destructured;

        await dispatchProps({
            collection,
            channel,
            subChannelKey: 'gdpr',
            props: props.gdpr,
        });

        await dispatchProps({
            collection,
            channel,
            subChannelKey: 'scientific',
            props: props.scientific,
        });
    },
});
