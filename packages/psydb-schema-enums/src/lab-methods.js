'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var config = require('@mpieva/psydb-common-config');

var createEnum = require('./create-enum');

var allLabMethodsMapping = {
    'inhouse': 'Inhouse Appointments',
    'away-team': 'External Appointments',
    'online-video-call': 'Online Video Appointments',
    'online-survey': 'Online Survey',
    'apestudies-wkprc-default': 'WKPRC',
    'manual-only-participation': 'Field Sites',
}

var sharedLabMethodMapping = (
    config.enabledLabMethods
    ? only({
        from: allLabMethodsMapping,
        paths: config.enabledLabMethods
    })
    : allLabMethodsMapping
);

var inviteLabMethods = createEnum.fromMap(only({
    from: sharedLabMethodMapping,
    paths: [ 'inhouse', 'online-video-call' ],
}));

var labMethods = createEnum.fromMap({
    ...sharedLabMethodMapping,
});

module.exports = {
    labMethods,
    inviteLabMethods,
}
