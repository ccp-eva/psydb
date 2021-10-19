'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var intersect = (a, b) => (
    a.filter(it => b.includes(it))
)

var checkCRTFieldPointers = ({
    crt,
    pointers,
}) => {
    var { fields, subChannelFields } = crt.state.settings;

    var available = [];
    if (subChannelFields) {
        available = (
            subChannelFields.scientific.map(it => (
                `/scientific/state/custom/${it.key}`
            ))
        );
    } 
    else {
        available = (
            fields.map(it => (
                `/state/custom/${it.key}`
            ))
        );
    }

    var intersection = intersect(available, pointers);
    if (intersection.length !== pointers.length) {
        throw new ApiError(400, 'InvalidCRTFieldPointers');
    }
}

module.exports = checkCRTFieldPointers;
