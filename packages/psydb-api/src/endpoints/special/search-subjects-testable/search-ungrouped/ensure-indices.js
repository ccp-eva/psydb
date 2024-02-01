'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');

var ensureIndices = async (bag) => {
    var { db, subjectTypeKey, dobFieldPointer } = bag;

    await db.collection('subject').ensureIndex({
        [convertPointerToPath(dobFieldPointer)]: 1
    }, {
        name: `ageFrameIndex`, // FIXME: mimimi
        //name: `ageFrameIndex_${subjectTypeKey}`
    });
}

module.exports = ensureIndices;
