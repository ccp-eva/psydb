module.exports = {
    participationStatus: {
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
    },
    unparticipationStatus: {
        keys: [
            // FIXME: im not sure if that should actually be
            // in invitation status
            'canceled-by-participant',
            'canceled-by-institute', // aka we uninvited the subject
            'deleted-by-institute', // XXX: we deleted the thing i guess??
            'moved-by-institute',
        ],
        names: [
            'abgesagt',
            'ausgeladen',
            'gelöscht',
            'verschoben',
        ]
    }
}
