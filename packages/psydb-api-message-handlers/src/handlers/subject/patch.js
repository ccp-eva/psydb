'use strict';
var nanoid = require('nanoid');
var jsonpointer = require('jsonpointer');
var escapeRX = require('escape-string-regexp');
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var {
    ApiError,
    fetchCRTSettings,
    createRecordLabel
} = require('@mpieva/psydb-api-lib');

var GenericRecordHandler = require('../../lib/generic-record-handler');
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages
} = require('../../lib/generic-record-handler-utils');

module.exports = GenericRecordHandler({
    collection: 'subject',
    op: 'patch',
    
    triggerSystemEvents: async (options) => {
        var { db, rohrpost, message, dispatchProps, dispatch } = options;

        var destructured = destructureMessage({ message });
        var {
            collection,
            recordType,
            props,
            additionalCreateProps // FIXME: rename extraPayload
        } = destructured;

        var { setIsHidden } = additionalCreateProps;

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });
    
        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'gdpr',
            props: props.gdpr,
        });

        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'scientific',
            props: props.scientific,
        });

        if (setIsHidden === true || setIsHidden === false) {
            console.log('changing visibility');
            var path = 'scientific.state.systemPermissions.isHidden';
            await dispatch({
                collection: 'subject',
                channelId: channel.id,
                subChannelKey: 'scientific',
                payload: { $set: {
                    [path]: setIsHidden
                }}
            });
        }
    },
});
