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

    var $comment = 'prefilterAgeFrames';
    return (
        OR.length > 0
        ? { $match: { $or: OR }}
        // FIXME: return undefined and use SmartArray in caller
        : { $match: { $expr: { $eq: [ 1, 1 ] } }}
    );
}

module.exports = {
    isRecordType,
    isNotOmitted,
    hasField,
    prefilterAgeFrames
}


