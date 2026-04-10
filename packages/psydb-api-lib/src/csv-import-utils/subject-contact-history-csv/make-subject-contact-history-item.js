'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');

var makeSubjectContactHistoryItem = (bag) => {
    var { pipelineItem, subjectType, timezone } = bag
    var {
        subjectId, contactType, date, time,
        status = 'sent', comment = ''
    } = pipelineItem.obj;
    
    var timestamp = convertYMDHMS({
        date, time, clientTZ: timezone,
    });
  
    var _id = ObjectId();
    var core = {
        type: contactType, csvImportId: null,
        subjectId, subjectType, // NOTE: not sure if better in state
        timezone,
        contactedBy: null,
        contactedAt: timestamp,
    }
    var state = { status, comment }

    return {
        record: { _id, ...core, state: state },
        parts: { _id, core, state }
    }
}

var convertYMDHMS = (bag) => {
    var { date, time, clientTZ } = bag;
    var converted = new Date(`${date}T${time}Z`);
    
    var swapped = swapTimezone({
        date: converted,
        sourceTZ: 'UTC',
        targetTZ: clientTZ,
    });

    return swapped;
}

module.exports = makeSubjectContactHistoryItem;
