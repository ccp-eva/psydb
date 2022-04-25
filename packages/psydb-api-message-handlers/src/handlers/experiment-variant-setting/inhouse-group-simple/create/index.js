'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var groupBy = require('@mpieva/psydb-common-lib/src/group-by');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../../lib/simple-handler'),
    createEvents = require('../../../../lib/create-event-messages-from-props');

var checkForeignIdsExist = require('../../../../lib/check-foreign-ids-exist');
var checkBasics = require('../../utils/check-create-basics');
var checkCRTFieldPointers = require('../../utils/check-crt-field-pointers');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'experiment-variant-setting/inhouse-group-simple/create',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache
}) => {

    await checkBasics({
        db,
        permissions,
        cache,
        message,
        type: 'inhouse-group-simple'
    });

    var { subjectTypeRecord } = cache;
    var {
        subjectFieldRequirements,
        locations
    } = message.payload.props;
    
    var locationsByType = groupBy({
        items: locations,
        byProp: 'customRecordTypeKey'
    });

    for (var typeKey of Object.keys(locationsByType)) {
        var values = locationsByType[typeKey];

        var locationTypeRecord = await (
            db.collection('customRecordType')
            .findOne(
                { collection: 'location', type: typeKey },
                { projection: { events: false }}
            )
        );
        if (!locationTypeRecord) {
            throw new ApiError(400, 'InvalidLocationRecordType');
        }

        var locationIds = values.map(it => it.locationId);
        await checkForeignIdsExist(db, {
            'location': {
                ids: locationIds,
                filters: { type: typeKey }
            },
        });

    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,

    dispatchProps,
}) => {
    var { type: messageType, payload } = message;
    var { id, studyId, experimentVariantId, props } = payload;

    await dispatchProps({
        collection: 'experimentVariantSetting',
        channelId: id,
        isNew: true,
        additionalChannelProps: {
            type: 'inhouse-group-simple',
            studyId,
            experimentVariantId
        },
        props,

        initialize: true,
        recordType: 'inhouse-group-simple',
    });
}

module.exports = handler;
