'use strict';

var isNotDummy = () => (
    { $match: {
        isDummy: { $ne: true }
    }}
)

module.exports = isNotDummy;
