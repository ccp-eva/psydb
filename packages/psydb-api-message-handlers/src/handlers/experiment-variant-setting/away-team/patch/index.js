'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { groupBy } = require('@mpieva/psydb-core-utils');
var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../../lib');

var checkBasics = require('../../utils/check-patch-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/away-team/patch',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message,
}) => {
    await checkBasics({
        db,
        permissions,
        cache,
        message,
    });

    var { subjectTypeRecord } = cache;
    var {
        subjectLocationFieldPointer,
    } = message.payload.props;
    
    checkCRTFieldPointers({
        crt: subjectTypeRecord,
        pointers: [ subjectLocationFieldPointer ],
        filters: {
            'systemType': 'ForeignId',
            'props.collection': 'location',
        }
    });
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    dispatchProps
}) => {
    var { type: messageType, payload } = message;
    var { id, props } = payload;
    
    await dispatchProps({
        collection: 'experimentVariantSetting',
        channelId: id,
        props
    });
}

module.exports = handler;
