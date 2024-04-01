'use strict';
var { without } = require('@mpieva/psydb-core-utils');
var { CRTSettings } = require('@mpieva/psydb-common-lib');
var { ApiError } = require('@mpieva/psydb-api-lib');

var checkCRTFieldPointers = (bag) => {
    var {
        crt: crtOrRecord,
        pointers,
        filters
    } = bag;

    var crt = (
        crtOrRecord.getRaw
        ? crtOrRecord
        : CRTSettings.fromRecord(crtOrRecord)
    );
    var found = crt.findCustomFields({
        ...filters,
        'pointer': { $in: pointers },
    });

    if (found.length !== pointers.length) {
        throw new ApiError(400, {
            apiStatus: 'InvalidCRTFieldPointers',
            data: {
                invalidPointers: without({
                    that: pointers,
                    without: found.map(it => it.pointer)
                })
            }
        });
    }
}

module.exports = checkCRTFieldPointers;
