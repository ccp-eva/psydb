'use strict';
var id = 'psy-db/location/baserecord',
    ref = { $ref: `${id}#` };

var LocationBaseRecord = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: id,
    oneOf: [
        InstituteBuilding,
        InstituteRoom,
        ExternalBuilding
        GPS,
    ]
}

// TODO: variant list to creat defaults

module.exports = {
    id,
    ref,
    schema: LocationBaseRecord,
}
