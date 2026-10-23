'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var columnsByType = {
    'email': '/_specialLatestContactEmail',
    'phone': '/_specialLatestContactPhone',
};

// NOTE: adds i.e. _specialLatestContactPhone to each record when
// the corresponding column is requested
var attachLatestContacts = async (bag) => {
    var { db, records, columns } = bag;

    var types = Object.keys(columnsByType).filter(type => (
        columns.includes(columnsByType[type])
    ));
    if (types.length < 1 || records.length < 1) {
        return records;
    }

    var latest = await aggregateToArray({ db, subjectContactHistory: [
        { $match: {
            'subjectId': { $in: records.map(it => it._id) },
            'type': { $in: types },
        }},
        { $sort: { 'contactedAt': -1 }},
        { $group: {
            _id: { subjectId: '$subjectId', type: '$type' },
            contactedAt: { $first: '$contactedAt' },
            status: { $first: '$state.status' },
            comment: { $first: '$state.comment' },
        }},
    ]});

    var latestForSubject = {};
    for (var it of latest) {
        var { subjectId, type } = it._id;
        var { contactedAt, status, comment } = it;

        if (!latestForSubject[subjectId]) {
            latestForSubject[subjectId] = {};
        }
        latestForSubject[subjectId][type] = { contactedAt, status, comment };
    }

    return records.map(record => {
        var out = { ...record };
        for (var type of types) {
            var key = columnsByType[type].slice(1);
            out[key] = latestForSubject[record._id]?.[type] || null;
        }
        return out;
    });
}

module.exports = attachLatestContacts;
