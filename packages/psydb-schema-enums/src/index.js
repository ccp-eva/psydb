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
    ],
    names: [
        'abgesagt',
        'ausgeladen',
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
        'Probanden',
        'Studien',
        'Externe Personen',
        'Externe Organinsationen'
    ]
})

var collections = createEnumFromKV({
    keys: [
        ...customRecordTypeCollections.keys,
        'personnel',
        'researchGroups',
        'experimentOperatorTeam',
        'experiment',
    ],
    names: [
        ...customRecordTypeCollections.names,
        'Mitarbeiter',
        'Forschungs-Gruppen',
        'Experimenter-Teams',
        'Termine',
    ]
})

// FIXME: rename labProcedureTypes
var experimentVariants = createEnumFromMap({
    'inhouse': 'Interne Termine',
    'away-team': 'Externe Termine',
    'online-video-call': 'Online-Video-Termine',
    'online-survey': 'Online-Umfrage',
});

var experimentTypes = createEnumFromMap({
    'inhouse': 'Interne Termine',
    'away-team': 'Externe Termine',
    'online-video-call': 'Online-Video-Termine',
});

var inviteExperimentTypes = createEnumFromMap({
    'inhouse': 'Interne Termine',
    'online-video-call': 'Online-Video-Termine',
});

var subjectFieldRequirementChecks = createEnumFromMap({
    'inter-subject-equality': 'ist Gleich im Termin'
})

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
    collections,

    experimentVariants,
    subjectFieldRequirementChecks,

    experimentTypes,
    inviteExperimentTypes,
}
