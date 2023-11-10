'use strict';
var createEnum = (list) => {
    var en = {
        list,
        mapping: {},
        keys: [],
        names: [],
    }

    en.getLabel = (key) => {
        var it = list.find(it => it.key === key);
        return it ? it.name : undefined;
    }
    
    // since the order within the object is technically not
    // deterministic we do it the safe way
    for (var it of list) {
        en.keys.push(it.key);
        en.names.push(it.name);
        en.mapping[it.key] = it.name;
    }

    return en;
};

var createEnumFromMap = (map) => {
    var list = Object.keys(map).map(key => ({
        key: key, name: map[key]
    }));

    return createEnum(list);
}

var createEnumFromKV = ({ keys, names }) => {
    var list = keys.map((it, ix) => ({
        key: it,
        name: names[ix]
    }));

    return createEnum(list);
}

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

var awayTeamParticipationStatus = createEnumFromMap({
    'participated': 'teilgenommen',
});

var awayTeamUnparticipationStatus = createEnumFromMap({
    'didnt-participate': 'nicht teilgenommen',
});

var inviteParticipationStatus = createEnumFromMap({
    'participated': 'teilgenommen',
    'showed-up-but-didnt-participate': 'gekommen',
    'didnt-show-up': 'nicht gekommen',
});

var inviteUnparticipationStatus = createEnumFromMap({
    'canceled-by-participant': 'abgesagt',
    'canceled-by-institute': 'ausgeladen',
});

var safeParticipationStatus = createEnumFromMap({
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

var customRecordTypeCollections = createEnumFromKV({
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

var collections = createEnumFromKV({
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

var foreignIdFieldCollections = createEnumFromKV({
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

// FIXME: rename labProcedureTypes
var experimentVariants = createEnumFromMap({
    'inhouse': 'Inhouse Appointments',
    'away-team': 'External Appointments',
    'online-video-call': 'Online Video Appointments',
    'online-survey': 'Online Survey',
    //'inhouse-group-simple': 'Interne Gruppen Termine (WKPRC)'
});

var experimentTypes = createEnumFromMap({
    'inhouse': 'Inhouse Appointments',
    'away-team': 'External Appointments',
    'online-video-call': 'Online Video Appointments',
    //'inhouse-group-simple': 'Interne Gruppen Termine (WKPRC)'
});

var inviteExperimentTypes = createEnumFromMap({
    'inhouse': 'Inhouse Appointments',
    'online-video-call': 'Online Video Appointments',
});

var subjectFieldRequirementChecks = createEnumFromMap({
    'inter-subject-equality': 'Is Equal in Appointment'
})

var labMethods = createEnumFromMap({
    'inhouse': 'Inhouse Appointments',
    'away-team': 'External Appointments',
    'online-video-call': 'Online Video Appointments',
    'online-survey': 'Online Survey',
});

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

    experimentVariants,
    subjectFieldRequirementChecks,

    experimentTypes,
    inviteExperimentTypes,

    labMethods,
}
