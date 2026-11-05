'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');
var { swapTimezone } = require('@mpieva/psydb-timezone-helpers');
var { normalize: normalizeDate }
    = require('@mpieva/psydb-ajv-formats/src/date-ymd-or-dmy');

var makeSubjectContactHistoryItem = (bag) => {
    var { pipelineItem, subjectType, timezone } = bag
    var {
        subjectId, contactType, date, contactedBy,
        time = '12:00', status = 'sent', comment = ''
    } = pipelineItem.obj;
    
    var timestamp = convertYMDHMS({
        date, time, clientTZ: timezone,
    });
  
    var _id = ObjectId();
    var core = {
        type: contactType, csvImportId: null,
        subjectId, subjectType, // NOTE: not sure if better in state
        timezone,
        contactedBy,
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
    var converted = new Date(`${normalizeDate(date)}T${time}Z`);
    
    var swapped = swapTimezone({
        date: converted,
        sourceTZ: 'UTC',
        targetTZ: clientTZ,
    });

    return swapped;
}

module.exports = makeSubjectContactHistoryItem;
