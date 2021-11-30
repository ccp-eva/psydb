'use strict';

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

module.exports = {
    hasIntersection
}
