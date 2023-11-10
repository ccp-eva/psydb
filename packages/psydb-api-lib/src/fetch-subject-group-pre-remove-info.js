'use strict';
var { hasNone } = require('@mpieva/psydb-core-utils');
var fetchRecordReverseRefs = require('./fetch-record-reverse-refs');

var fetchSubjectGroupPreRemoveInfo = async (bag) => {
    var { db, subjectGroupId, subjectGroupRecord = undefined } = bag;
    
    if (!subjectGroupRecord) {
        subjectGroupRecord = await (
            db.collection('subjectGroup').findOne({
                _id: subjectGroupId
            })
        );
    }

    var experiments = await (
        db.collection('experiment').find(
            { 
                'state.subjectGroupId': subjectGroupRecord._id,
                'state.isCanceled': { $ne: true },
                $or: [
                    { 'state.isPostprocessed': { $ne: true }},
                    {
                        'state.isPostprocessed': true,
                        'state.subjectData.participationStatus': (
                            'participated'
                        ),
                    }
                ]
            },
            { projection: {
                _id: true,
                type: true,
                realType: true,
                'state.interval': true,
            }}
        ).toArray()
    );

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        //recordId: subjectGroupId, // FIXME maybe other have this issue too
        recordId: subjectGroupRecord._id,
        refTargetCollection: 'subjectGroup',
        excludedCollections: [ 'experiment' ], // done manually
    });

    // TODO: return value of reverse refs does not have _recordLabel
    // property

    var canRemove = (
        hasNone(experiments) && hasNone(reverseRefs)
    );

    return {
        canRemove,
        experiments,
        reverseRefs
    }
}

module.exports = { fetchSubjectGroupPreRemoveInfo };
