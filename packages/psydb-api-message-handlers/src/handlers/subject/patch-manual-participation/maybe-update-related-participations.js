'use strict';
var omit = require('@cdxoo/omit');
var { compareIds } = require('@mpieva/psydb-core-utils');
var findParticipation = require('./find-participation');

var maybeUpdateRelatedParticipations = async (context) => {
    var { db, dispatch, cache } = context;
    var { originalItem, patchedItem } = cache;

    var experiment = await db.collection('experiment').findOne({
        _id: originalItem.experimentId
    });

    var { subjectData } = experiment.state;
    for (var it of subjectData) {
        var { subjectId } = it;
        if (compareIds(originalItem.subjectId, subjectId)) {
            continue;
        }
        
        var subject = await (
            db.collection('subject').findOne({ _id: subjectId })
        );
        var [ pix, otherOriginal ] = findParticipation({
            subject, experimentId: experiment._id, as: 'entry'
        });
        if (pix < 0) {
            continue;
        }

        var otherPatched = {
            ...otherOriginal,
            ...omit([ '_id', 'status' ], patchedItem),
        };

        var participationPath = (
            `scientific.state.internals.participatedInStudies.${pix}`
        );

        await dispatch({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            payload: { $set: {
                [participationPath]: otherPatched
            }},
        });
    }
}

module.exports = maybeUpdateRelatedParticipations;
