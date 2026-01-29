'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var getFilteredStudyIds = async (bag) => {
    var { db, studyRecords, allowedExperimentTypes } = bag;

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                studyId: { $in: studyRecords.map(it => it._id) },
                type: { $in: allowedExperimentTypes },
            }},
            { $project: {
                studyId: true,
            }}
        ]).toArray()
    );

    var studyIds = (
        studyRecords
        .filter(study => (
            settingRecords.find(setting => (
                compareIds(study._id, setting.studyId))
            )
        ))
        .map(it => it._id)
    );

    return studyIds;
}

module.exports = getFilteredStudyIds;
