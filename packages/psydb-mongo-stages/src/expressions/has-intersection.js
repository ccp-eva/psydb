'use strict';
// FIXME: use hasIntersectionLength({ sets, $gt: 0 })
var hasIntersection = (options) => {
    var { sets } = options;
    return (
        { $gt: [
            { $size: {
                $ifNull: [
                    { $setIntersection: sets },
                    []
                ]
            }},
            0
        ]}
    )
}

module.exports = hasIntersection;
