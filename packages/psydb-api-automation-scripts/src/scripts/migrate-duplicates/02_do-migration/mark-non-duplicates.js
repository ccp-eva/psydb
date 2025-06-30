'use strict';
var { aggregateToIds } = require('@mpieva/psydb-mongo-adapter');

module.exports = async (bag) => {
    var { db, driver, sequenceNumbers } = bag;

    var subjectIds = await aggregateToIds({ db, subject: [
        { $match: {
            type: 'child',
            sequenceNumber: { $in: sequenceNumbers }
        }},
        { $project: { _id: true }}
    ]});

    console.log({ subjectIds });

    await driver.sendMessage({
        type: 'subject/mark-non-duplicates',
        payload: { subjectIds }
    });
}
