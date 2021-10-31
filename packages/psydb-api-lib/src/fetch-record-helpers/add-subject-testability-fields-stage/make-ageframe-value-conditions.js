'use strict';
var { groupBy } = require('@mpieva/psydb-common-lib');
var convertPointerToPath = require('../../convert-pointer-to-path');

var makeAgeFrameValueConditions = (options) => {
    var { ageFrameValueFilters } = options;

    var filtersByPointer = groupBy({
        items: ageFrameValueFilters,
        byProp: 'pointer',
    });

    var conditions = [];
    for (var pointer of Object.keys(filtersByPointer)) {
        var group = filtersByPointer[pointer];
        conditions.push(
            MongoExpression({
                path: convertPointerToPath(pointer),
                values: group.map(it => it.value)
            })
        )
    } 
    return conditions;
}

// FIXME: we can make it so that expression only acceps one value
// at a time and $or them togeter this might simplify the whole thing
var MongoExpression = (options) => {
    var { path, values } = options;
    return ({
        $cond: {
            if: { $isArray: '$' + path },
            then: { $gt: [
                { $size: {
                    $ifNull: [
                        { $setIntersection: [ '$' + path, values ]},
                        []
                    ]
                }},
                0
            ]},
            else: { $in: [ '$' + path, values ]}
        }
    })
}

module.exports = makeAgeFrameValueConditions;
