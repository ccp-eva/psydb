'use strict';
var {
    compareIds,
    convertPointerToPath
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
        db,
        collectionName: collection,
        recordType
    });

    var { hasSubChannels, fieldDefinitions } = crtSettings;
    var foreignIdFieldsWithTargetRef = [];
    if (hasSubChannels) {
        for (var sc of Object.keys(fieldDefinitions)) {
            for (var it of fieldDefinitions[sc]) {
                if (
                    it.type === 'ForeignId'
                    && it.props.addReferenceToTarget
                ) {
                    foreignIdFieldsWithTargetRef.push({
                        subChannelKey: sc,
                        ...it
                    });
                }
            }
        }
    }
    else {
        for (var it of fieldDefinitions) {
            if (
                it.type === 'ForeignId'
                && it.props.addReferenceToTarget
            ) {
                foreignIdFieldsWithTargetRef.push(it);
            }
        }
    }

    for (var it of foreignIdFieldsWithTargetRef) {
        var sc = it.subChannelKey;
        var targetFieldPath = convertPointerToPath(
            it.props.targetReferenceField
        );

        var dispatchBag = {
            collection: it.props.collection,
            ...(it.subChannelKey && {
                subChannelKey: it.subChannelKey
            }),
        };

        var dispatchBag = undefined;
        if (op === 'create') {
            var nextTargetChannelId = (
                sc
                ? nextProps[sc].custom[it.key]
                : nextProps.custom[it.key]
            ); 

            if (nextTargetChannelId) {
                dispatchBag = {
                    collection: it.props.collection,
                    ...(sc && { subChannelKey: sc }),
                    channelId: nextTargetChannelId,
                    payload: { $addToSet: {
                        [targetFieldPath]: currentChannelId
                    }}
                };

                await dispatch(dispatchBag);
            }
        }
        else if (op === 'patch') {
            var currentTargetChannelId = (
                sc
                ? currentProps[sc].custom[it.key]
                : currentProps.custom[it.key]
            );
            var nextTargetChannelId = (
                sc
                ? nextProps[sc].custom[it.key]
                : nextProps.custom[it.key]
            );

            if (!compareIds(currentTargetChannelId, nextTargetChannelId)) {
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

                if (nextTargetChannelId) {
                    await dispatch({
                        collection: it.props.collection,
                        ...(sc && { subChannelKey: sc }),
                        channelId: nextTargetChannelId,
                        payload: { $addToSet: {
                            [targetFieldPath]: currentChannelId
                        }}
                    });
                }
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

module.exports = { maybeUpdateForeignIdTargets };
