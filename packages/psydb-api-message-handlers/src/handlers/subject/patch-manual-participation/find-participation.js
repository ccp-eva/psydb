'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var findParticipation = (bag) => {
    var { subject, experimentId, participationId, as } = bag;

    var { participatedInStudies } = subject.scientific.state.internals;
    var index = (
        participatedInStudies
        .findIndex(it => (
            (
                participationId 
                ? compareIds(it._id, participationId) : true
            )
            && (
                experimentId
                ? compareIds(it.experimentId, experimentId) : true
            )
        ))
    );
    var item = participatedInStudies[index];

    switch (as) {
        case 'index':
            return index;
        case 'entry':
            return [ index, item ];
        case 'item':
        default:
            return item;
    }
}

module.exports = findParticipation;
