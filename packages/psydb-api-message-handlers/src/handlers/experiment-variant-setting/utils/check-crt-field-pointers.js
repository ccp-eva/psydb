'use strict';
var isSubset = require('is-subset');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var intersect = (a, b) => (
    a.filter(it => b.includes(it))
)

var checkCRTFieldPointers = ({
    crt,
    pointers,
    filters
}) => {
    var { fields, subChannelFields } = crt.state.settings;

    var getFieldPointer,
        targetFields;
    if (subChannelFields) {
        getFieldPointer = (field) => (
            `/scientific/state/custom/${field.key}`
        );
        targetFields = subChannelFields.scientific;
    }
    else {
        getFieldPointer = (field) => (
            `/state/custom/${field.key}`
        );
        targetFields = fields;
    }

    var available = (
        subChannelFields.scientific
        .filter(field => !filters || isSubset(field, filters))
        .map(getFieldPointer)
    );

    var intersection = intersect(available, pointers);
    if (intersection.length !== pointers.length) {
        throw new ApiError(400, 'InvalidCRTFieldPointers');
    }
}

module.exports = checkCRTFieldPointers;
