'use strict';
var { nanoid } = require('nanoid');
var { createId } = require('@mpieva/psydb-api-lib');

var createLocationVisit = async (context, bag) => {
    var { dispatch } = context;
    var {
        labProcedureType,
        location,

        experimentId,
        timestamp,
        study,
    } = bag;
    
    if (labProcedureType === 'online-survey') {
        return;
    }

    var visitationItem = {
        experimentType: labProcedureType,
        experimentId,
        timestamp,
        studyId: study._id,
    }

    await dispatch({
        collection: 'location',
        channelId: location._id,
        payload: { $push: {
            'state.internals.visits': (
                visitationItem
            ),
        }}
    });
}

module.exports = createLocationVisit;
