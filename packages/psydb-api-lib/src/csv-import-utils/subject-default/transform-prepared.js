'use strict';
var makeSubject = require('./make-subject');

var transformPrepared = (bag) => {
    var { preparedObjects, subjectCRT, researchGroup, timezone } = bag;

    var transformed = {
        subjects: [],
    }
    for (var obj of preparedObjects) {
        var { record, parts } = makeSubject({
            preparedObject: obj,
           
            subjectCRT,
            researchGroup,
            timezone
        });
        transformed.subjects.push({ record, parts });
    }
    return transformed;
}

module.exports = transformPrepared;
