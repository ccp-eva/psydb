'use strict';
var createEnum = require('./create-enum');
var { labMethods, inviteLabMethods } = require('./lab-methods');

var safeUnparticipationStatus = {
    keys: [
        // FIXME: im not sure if that should actually be
        // in invitation status
        'canceled-by-participant',
        'canceled-by-institute', // aka we uninvited the subject
        'didnt-participate',
    ],
    names: [
        'abgesagt',
        'ausgeladen',
        'nicht teilgenommen',
    ]
}

var awayTeamParticipationStatus = createEnum.fromMap({
    'participated': 'teilgenommen',
});

var awayTeamUnparticipationStatus = createEnum.fromMap({
    'didnt-participate': 'nicht teilgenommen',
});

var inviteParticipationStatus = createEnum.fromMap({
    'participated': 'teilgenommen',
    'showed-up-but-didnt-participate': 'gekommen',
    'didnt-show-up': 'nicht gekommen',
});

var inviteUnparticipationStatus = createEnum.fromMap({
    'canceled-by-participant': 'abgesagt',
    'canceled-by-institute': 'ausgeladen',
});

var safeParticipationStatus = createEnum.fromMap({
    ...awayTeamParticipationStatus.mapping,
    ...inviteParticipationStatus.mapping,
});

var participationStatus = {
    keys: [
        'unknown',
        ...safeParticipationStatus.keys,
    ],
    names: [
        'unbekannt',
        ...safeParticipationStatus.names,
    ],
};

var unparticipationStatus = {
    keys: [
        ...safeUnparticipationStatus.keys,
        'deleted',
    ],
    names: [
        ...safeUnparticipationStatus.names,
        'gelöscht',
    ]
}

var customRecordTypeCollections = createEnum.fromKV({
    keys: [
        'location',
        'subject',
        'study',
        'externalPerson',
        'externalOrganization',
    ],
    names: [
        'Locations',
        'Subjects',
        'Studies',
        'External Persons',
        'External Organizations'
    ]
})

var collections = createEnum.fromKV({
    keys: [
        ...customRecordTypeCollections.keys,
        'personnel',
        'researchGroup',
        'experimentOperatorTeam',
        'experiment',
        'helperSet',
        'systemRole',
        'customRecordType',
        'studyTopic',
        'subjectGroup',
    ],
    names: [
        ...customRecordTypeCollections.names,
        'Staff Members',
        'Research Groups',
        'Lab Teams',
        'Appointments',
        'Helper Tables',
        'System Roles',
        'Record Types',
        'Study Topics',
        'Subject Groups'
    ]
})

var foreignIdFieldCollections = createEnum.fromKV({
    keys: [
        ...customRecordTypeCollections.keys,
        'personnel',
        'studyTopic',
        'subjectGroup',
    ],
    names: [
        ...customRecordTypeCollections.names,
        'Mitarbeiter:in',
        'Themengebiete',
        'Proband:innen-Gruppe',
    ]
})

var subjectFieldRequirementChecks = createEnum.fromMap({
    'inter-subject-equality': 'Is Equal in Appointment'
});

// FIXME:
var inviteExperimentTypes = inviteLabMethods;
var experimentVariants = labMethods;
var experimentTypes = labMethods;

module.exports = {
    awayTeamParticipationStatus,
    awayTeamUnparticipationStatus,
    inviteParticipationStatus,
    inviteUnparticipationStatus,

    safeParticipationStatus,
    participationStatus,
    safeUnparticipationStatus,
    unparticipationStatus,

    customRecordTypeCollections,
    foreignIdFieldCollections,
    collections,

    subjectFieldRequirementChecks,

    labMethods,
    inviteLabMethods,

    // FIXME
    experimentTypes,
    experimentVariants,
    inviteExperimentTypes,
}
