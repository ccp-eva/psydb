'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { fetchCRTSettings } = require('@mpieva/psydb-api-lib');
var { ProjectDisplayFieldsStage }
    = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var lookupSubjects = {};

lookupSubjects.onlyDisplayFields = async (bag) => {
    var { db, subjectType, subjectIds } = bag;
    
    var crt = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType, wrap: true
    });

    var definitions = [
        ...crt.augmentedDisplayFields('table'),
        ...crt.augmentedDisplayFields('selectionRow'),
    ];

    var records = await aggregateToArray({ db, subject: [
        { $match: { '_id': { $in: subjectIds }}},
        ProjectDisplayFieldsStage({ displayFields: definitions }),
    ]});
    
    return { records, definitions };

    //var typestubs = await aggregateToArray({ db, subject: [
    //    { $match: { '_id': { $in: subjectIds }}};
    //    { $project: { 'type': true }},
    //    { $group: { '_id': '$type' }}
    //]});

    //var subjectTypes = typestubs.map(it => it._id);

    //var out = [];
    //for (var it of subjectTypes) {
    //}

    //return { records, related, displayFields };
}

lookupSubjects.fullRecords = async (bag) => {
    var { db, subjectIds } = bag;

    var records = await aggregateToArray({ db, subject: [
        { $match: { '_id': { $in: subjectIds }}}
    ]});

    return { records };
}

module.exports = lookupSubjects;
