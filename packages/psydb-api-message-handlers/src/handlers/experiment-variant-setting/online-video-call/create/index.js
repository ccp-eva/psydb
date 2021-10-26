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
    messageType: 'experiment-variant-setting/online-video-call/create',
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
        type: 'online-video-call'
    });

    var { subjectTypeRecord } = cache;
    var { subjectTypeRecord } = cache;
    var {
        subjectFieldRequirements,
        locations
    } = message.payload.props;
    
    
    var pointers = subjectFieldRequirements.map(it => it.pointer);
    checkCRTFieldPointers({
        crt: subjectTypeRecord,
        pointers,
    });
    
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
}) => {
    var { type: messageType, payload } = message;
    var { id, studyId, experimentVariantId, props } = payload;

    var channel = (
        rohrpost
        .openCollection('experimentVariantSetting')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: {
                type: 'online-video-call',
                studyId,
                experimentVariantId
            }
        })
    );

    var messages = createEvents({
        op: 'put',
        personnelId,
        props
    })

    await channel.dispatchMany({ messages });
}

module.exports = handler;
