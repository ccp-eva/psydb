'use strict';
module.exports = {
    createAllSchemas: require('./create-all/'),
};

var internals = require('./collection');
module.exports.CustomRecordTypeState = internals.CustomRecordTypeState;
module.exports.HelperSetState = internals.HelperSetState;
module.exports.HelperSetItemState = internals.HelperSetItemState;
module.exports.PersonnelScientificState = internals.PersonnelScientificState;
module.exports.PersonnelGdprState = internals.PersonnelGdprState;
module.exports.SubjectScientificState = internals.SubjectScientificState;
module.exports.SbjectGdprState = internals.SbjectGdprState;
module.exports.LocationState = internals.LocationState;
module.exports.SystemRoleState = internals.SystemRoleState;

// NOTE this fixed the circular issue
module.exports.collectionMetadata = require('./collection-metadata');
