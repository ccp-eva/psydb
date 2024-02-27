'use strict';
var { ObjectId } = require('@mpieva/psydb-api-lib');
var {
    convertPointerToPath,
    arrify, without,
} = require('@mpieva/psydb-core-utils');

var { fetchCRTSettings } = require('@mpieva/psydb-api-lib');

var maybeUpdateForeignIdTargets = async (bag) => {
    var {
        db,
        dispatch,
        collection,
        recordType,

        currentProps,
        nextProps,

        currentChannelId,
        op,
    } = bag;
   
    var crtSettings = await fetchCRTSettings({
        db, collectionName: collection, recordType,
        wrap: true,
    });

    var foreignIdFieldsWithTargetRef = (
        crtSettings.findCustomFields({
            'type': { $in: [ 'ForeignId', 'ForeignIdList' ]},
            'props.addReferenceToTarget': true
        })
    );

    for (var it of foreignIdFieldsWithTargetRef) {
        var { subChannel, key: fieldKey, props } = it;
        var { collection, targetReferenceField } = props;

        var commonWrapperBag = {
            dispatch,
            ourChannelId: currentChannelId,
            subChannelKey: subChannel,
            collection,
            targetReferenceField
        }
        var pullUsFromTarget = createWrappedDispatch({
            ...commonWrapperBag, mongoOp: '$pull'
        });
        var addUsToTarget = createWrappedDispatch({
            ...commonWrapperBag, mongoOp: '$addToSet'
        });

        if (op === 'create') {
            var targetChannelIds = arrify((
                subChannel
                ? nextProps[subChannel].custom[fieldKey]
                : nextProps.custom[fieldKey]
            ), { removeNullishScalar: true });

            if (targetChannelIds.length > 0) {
                for (var targetChannelId of targetChannelIds) {
                    await addUsToTarget({ targetChannelId });
                }
            }
        }
        else if (op === 'patch') {
            var currentTargetChannelIds = arrify((
                subChannel
                ? currentProps[subChannel].custom[fieldKey]
                : currentProps.custom[fieldKey]
            ), { removeNullishScalar: true });

            var nextTargetChannelIds = arrify((
                subChannel
                ? nextProps[subChannel].custom[fieldKey]
                : nextProps.custom[fieldKey]
            ), { removeNullishScalar: true });

            // FIXME: maybe use comapreIds; patch coreutils/without
            var [ todoAddToSet, todoPull ] = crossdiff({
                old: strings(currentTargetChannelIds),
                next: strings(nextTargetChannelIds)
            }).map(oids);

            for (var targetChannelId of todoPull) {
                await pullUsFromTarget({ targetChannelId });
            }
            for (var targetChannelId of todoAddToSet) {
                await addUsToTarget({ targetChannelId });
            }
        }
        /*else if (op === 'remove') {
            var currentTargetChannelId = (
                sc
                ? currentProps[sc].custom[it.key]
                : currentProps.custom[it.key]
            );
            if (currentTargetChannelId) {
                await dispatch({
                    collection: it.props.collection,
                    ...(sc && { subChannelKey: sc }),
                    channelId: currentTargetChannelId,
                    payload: { $pull: {
                        [targetFieldPath]: currentChannelId
                    }}
                });
            }
        }
        else if (op === 'restore') {
            var currentTargetChannelId = (
                sc
                ? currentProps[sc].custom[it.key]
                : currentProps.custom[it.key]
            );
            if (currentTargetChannelId) {
                await dispatch({
                    collection: it.props.collection,
                    ...(sc && { subChannelKey: sc }),
                    channelId: currentTargetChannelId,
                    payload: { $addToSet: {
                        [targetFieldPath]: currentChannelId
                    }}
                });
            }
        }*/
        else {
            throw new Error(`unknown op "${op}"`);
        }
    }
}

var createWrappedDispatch = (bag) => {
    var {
        dispatch,
        ourChannelId,

        subChannelKey,
        collection,
        targetReferenceField,

        mongoOp
    } = bag;

    var targetFieldPath = convertPointerToPath(targetReferenceField);

    return ({ targetChannelId }) => (
        dispatch({
            collection,
            channelId: targetChannelId,
            ...(subChannelKey && { subChannelKey }),
            payload: { [mongoOp]: {
                [targetFieldPath]: ourChannelId,
            }}
        })
    )
}

var strings = (ary) => (
    ary.map(String)
);

var oids = (ary) => (
    ary.map(ObjectId)
);

// TODO: maybe core utils?
var crossdiff = ({ old, next }) => {
    var removed = without({
        that: old,
        without: next,
    });
    var created = without({
        that: next,
        without: old
    });

    return [ created, removed ];
}

module.exports = { maybeUpdateForeignIdTargets };
