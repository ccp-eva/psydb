var participationStatus = {
    keys: [
        'unknown',
        'participated',
        'showed-up-but-didnt-participate',
        'did-show-up', // XXX is that even a thing?
        'didnt-show-up',
    ],
    names: [
        'unbekannt',
        'teilgenommen',
        'nicht teilgenommen',
        'nur erschienen',
        'nicht erschienen',
    ],
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

module.exports = {
    participationStatus,
    safeUnparticipationStatus,
    unparticipationStatus,
}
