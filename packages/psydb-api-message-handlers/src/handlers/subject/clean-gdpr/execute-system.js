'use strict';
var { jsonpointer, compareIds } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { fetchCRTSettings } = require('@mpieva/psydb-api-lib');
var calculateAge = require('@mpieva/psydb-calculate-age');

var executeSystemEvents = async (context) => {
    var { db, dispatch, message, cache } = context;
    var { _id } = message.payload;

    var { subject } = cache.get();

    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', 
        recordType: subject.type, wrap: true
    });

    var bag = { db, dispatch, subject, subjectCRT };
    await maybeFixateExperimentTestingAges(bag);
    await maybeFixateParticipationTestingAges(bag); // XXX

    await dispatch.makeClean({
        collection: 'subject',
        channelId: _id, subChannelKey: 'gdpr',
    });
}

var maybeFixateExperimentTestingAges = async (bag) => {
    var { db, dispatch, subject, subjectCRT } = bag;
    
    var dobField = subjectCRT.findOneCustomField({
        'props.isSpecialAgeFrameField': true
    });
    console.log(dobField);

    if (!dobField) {
        return;
    }
    
    var dob = jsonpointer.get(subject, dobField.pointer);
    console.log(dob);

    if (!dob) {
        return;
    }

    var experiments = await aggregateToArray({ db, experiment: {
        'state.subjectData.subjectId': subject._id
    }});

    for (var it of experiments) {
        var { _id: experimentId, state } = it;
        var { interval, subjectData } = state;
        
        var testingAge = calculateAge({
            base: dob, relativeTo: interval.start,
            asString:false
        });
        
        var ix = subjectData.findIndex((it) => (
            compareIds(it.subjectId, subject._id)
        ))

        console.log({ experimentId });
        await dispatch({
            collection: 'experiment',
            channelId: experimentId,
            payload: { $set: {
                [`state.subjectData.${ix}.testingAge`]: testingAge
            }}
        })
    }
}

var maybeFixateParticipationTestingAges = async (bag) => {
    var { db, dispatch, subject, subjectCRT } = bag;
    
    var dobField = subjectCRT.findOneCustomField({
        'props.isSpecialAgeFrameField': true
    });
    console.log(dobField);

    if (!dobField) {
        return;
    }
    
    var dob = jsonpointer.get(subject, dobField.pointer);
    console.log(dob);

    if (!dob) {
        return;
    }

    var SET = {};
    var prefix = 'scientific.state.internals.participatedInStudies';

    var items = subject.scientific.state.internals.participatedInStudies || []
    for (var [ix, it] of items.entries()) {
        var { timestamp } = it;

        var testingAge = calculateAge({
            base: dob, relativeTo: timestamp,
            asString:false
        });

        SET[`${prefix}.${ix}.testingAge`] = testingAge;
    }

    console.log(SET);

    await dispatch({
        collection: 'subject',
        channelId: subject._id,
        subChannelKey: 'scientific',
        payload: { $set: SET }
    });

}
module.exports = { executeSystemEvents }
