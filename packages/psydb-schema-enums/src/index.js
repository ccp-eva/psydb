'use strict';
var createEnum = (mapping) => {
    var en = {
        mapping,
        keys: [],
        names: []
    }
    
    // since the order within the object is technically not
    // deterministic we do it the safe way
    for (var k of Object.keys(mapping)) {
        en.keys.push(k);
        en.names.push(mapping[k]);
    }

    return en;
};

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

var safeParticipationStatus = {
    keys: [
        'participated',
        'showed-up-but-didnt-participate',
        'did-show-up', // XXX is that even a thing?
        'didnt-show-up',
    ],
    names: [
        'teilgenommen',
        'nicht teilgenommen',
        'nur erschienen',
        'nicht erschienen',
    ]
}


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
        'deleted', // XXX: we deleted the thing i guess??
        'moved',
    ],
    names: [
        ...safeUnparticipationStatus.names,
        'gelöscht',
        'verschoben',
    ]
}

var customRecordTypeCollections = {
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
}

var collections = {
    keys: [
        ...customRecordTypeCollections.keys,
        'personnel',
        'researchGroups',
    ],
    names: [
        ...customRecordTypeCollections.names,
        'Mitarbeiter',
        'Forschungs-Gruppen'
    ]
}

// FIXME: rename labProcedureTypes
var experimentVariants = createEnum({
    'inhouse': 'Interne Termine',
    'away-team': 'Externe Termine',
    'online-video-call': 'Online-Video-Termine',
    'online-survey': 'Online-Umfrage',
});

var experimentTypes = createEnum({
    'inhouse': 'Interne Termine',
    'away-team': 'Externe Termine',
    'online-video-call': 'Online-Video-Termine',
});

var inviteExperimentTypes = createEnum({
    'inhouse': 'Interne Termine',
    'online-video-call': 'Online-Video-Termine',
});

var subjectFieldRequirementChecks = createEnum({
    'inter-subject-equality': 'ist Gleich im Termin'
})

module.exports = {
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
