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
    dispatchRecordPropMessages,
    maybeUpdateForeignIdTargets
} = require('../../lib/generic-record-handler-utils');

module.exports = GenericRecordHandler({
    collection: 'subject',
    op: 'create',
    checkAllowedAndPlausible: async (context) => {
        await GenericRecordHandler.checkAllowedAndPlausible(context);

        var { db, message } = context;
        
        var destructured = destructureMessage({ message });
        var {
            collection,
            recordType,
            props,
            additionalCreateProps,
            timezone
        } = destructured;
       
        console.log(additionalCreateProps);
        console.log(timezone);
        var { forceDuplicate } = additionalCreateProps;

        if (!forceDuplicate) {
            await verifyNoDuplicates({
                db,
                collection,
                recordType,
                data: props,
                timezone,
            })
        }
    },
    triggerSystemEvents: async (options) => {
        var {
            db,
            rohrpost,
            personnelId,
            message,
            cache,
            dispatch,
            dispatchProps
        } = options;

        var destructured = destructureMessage({ message });
        var {
            collection,
            recordType,
            props,
            additionalCreateProps: extra, // FIXME: rename extraPayload
        } = destructured;
        
        var { setIsHidden, ...additionalCreateProps } = extra;

        var { forceDuplicate } = additionalCreateProps;
        delete additionalCreateProps.forceDuplicate;

        if (!additionalCreateProps.onlineId) {
            additionalCreateProps.onlineId = nanoid.customAlphabet(
                [
                    '123456789',
                    'abcdefghikmnopqrstuvwxyz',
                    'ABCDEFGHJKLMNPQRSTUVWXYZ'
                ].join(''), 8
            )();
        }

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured,
            additionalCreateProps,
        });
        var currentChannelId = channel.id;

        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'gdpr',
            props: props.gdpr,
            initialize: true,
        });

        await dispatchProps({
            collection,
            channel,
            recordType,
            subChannelKey: 'scientific',
            props: props.scientific,
            initialize: true,
        });
        
        if (setIsHidden === true || setIsHidden === false) {
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

        await maybeUpdateForeignIdTargets({
            db,
            dispatch,
            collection,
            recordType,
            currentChannelId,
            nextProps: props,
            op: 'create'
        });

    },
});

var verifyNoDuplicates = async (bag) => {
    var { db, collection, recordType, data, timezone } = bag;

    var crt = await fetchCRTSettings({
        db, collectionName: collection, recordType,
        wrap: true
    });
   
    var {
        duplicateCheckSettings = {},
        recordLabelDefinition
    } = crt.getRaw();

    var { fieldSettings } = duplicateCheckSettings;

    if (!fieldSettings || fieldSettings.length < 1) {
        return;
    }

    var filters = {};
    for (var it of fieldSettings) {
        var { pointer } = it;
        var path = convertPointerToPath(pointer);
        var value = jsonpointer.get(
            data,
            pointer.replace('/state', '')
        );

        filters[path] = (
            typeof value === 'string'
            ? new RegExp(escapeRX(value), 'i')
            : value
        );
    }
    //console.log(data);
    //console.log(filters);

    var possibleDuplicates = await (
        db.collection(collection).find(
            {
                ...filters,
                'scientific.state.internals.isRemoved': { $ne: true }
            },
            { projection: {
                '_rohrpostMetadata': false,
                'gdpr._rohrpostMetadata': false,
                'scientific._rohrpostMetadata': false,
                'scientific.state.internals': false
            }}
        ).limit(4).toArray()
    );

    for (var it of possibleDuplicates) {
        it._recordLabel = createRecordLabel({
            record: it,
            definition: recordLabelDefinition,
            timezone
        });
    }

    if (possibleDuplicates.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'DuplicateSubject',
            data: {
                possibleDuplicates: (
                    possibleDuplicates
                    .slice(0,3)
                    .map(it => ({
                        _id: it._id,
                        _recordLabel: it._recordLabel
                    }))
                ),
                more: possibleDuplicates.length > 3
            }
        })
    }

}
