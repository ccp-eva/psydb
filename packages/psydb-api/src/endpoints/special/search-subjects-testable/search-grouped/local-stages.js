'use strict';
var {
    timeshiftAgeFrame,
} = require('@mpieva/psydb-common-lib');



var isRecordType = ({ type }) => (
    { $match: { type }}
)

var isNotOmitted = () => (
    { $match: {
        isDummy: { $ne: true },
        'scientific.state.systemPermissions.isHidden': { $ne: true },
        'scientific.state.internals.isRemoved': { $ne: true },
    }}
)

var hasField = (bag) => {
    var { path, excludedValues } = bag;

    var AND = [
        { [path]: { $exists: true }},
        { [path]: { $not: { $type: 10 }}} // not null
    ];

    if (excludedValues) {
        AND.push({ [path]: { $nin: excludedValues }});
    }

    return { $match: { $and: AND }}
}

var prefilterAgeFrames = (bag) => {
    var { targetInterval, ageFrameFilters, dobFieldPath } = bag;
    
    var OR = [];
    for (var it of ageFrameFilters) {
        var shifted = timeshiftAgeFrame({
            targetInterval,
            ageFrame: it.interval
        });
            
        OR.push(
            { $and: [
                { [dobFieldPath]: { $gte: shifted.start }},
                { [dobFieldPath]: { $lt: shifted.end }},
            ]}
        )
    }

    return { $match: { $or: OR }};
}

module.exports = {
    isRecordType,
    isNotOmitted,
    hasField,
    prefilterAgeFrames
}


