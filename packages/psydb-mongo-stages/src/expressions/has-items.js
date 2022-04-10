'use strict';

var hasItems = (expression) => {
    return (
        { $gt: [
            { $size: {
                $ifNull: [
                    expression,
                    []
                ]
            }},
            0
        ]}
    )
}

module.exports = hasItems;
