'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var createEnum = require('./create-enum');

var allLabMethodsMapping = {
    'inhouse': 'Inhouse Appointments',
    'away-team': 'External Appointments',
    'online-video-call': 'Online Video Appointments',
    'online-survey': 'Online Survey',
    'apestudies-wkprc-default': 'WKPRC',
    'manual-only-participation': 'Field Sites',
}

var inviteLabMethods = createEnum.fromMap(only({
    from: allLabMethodsMapping,
    paths: [ 'inhouse', 'online-video-call' ],
}));

var labMethods = createEnum.fromMap({
    ...allLabMethodsMapping,
});

module.exports = {
    labMethods,
    inviteLabMethods,
}
