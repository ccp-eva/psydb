'use strict';
var hasIntersectionLength = (options) => {
    var { sets, ...rest } = options;
    var [ op = '$gt', length = 0 ] = Object.entries(rest)[0];

    return (
        { [op]: [
            { $size: {
                $ifNull: [ { $setIntersection: sets }, [] ]
            }},
            length
        ]}
    )
}

module.exports = hasIntersectionLength;
