'use strict';
var { verifyLabOperationAccess } = require('@mpieva/psydb-api-lib');

var verifyCalendarAccess = (bag) => {
    var {
        permissions,
        labMethods = undefined,
        researchGroupId = undefined
    } = bag;

    // can view any calendar
    verifyLabOperationAccess({
        permissions,
        researchGroupId: researchGroupId,
        labOperationTypes: labMethods,
        flag: 'canViewExperimentCalendar',
        
        matchTypes: 'some',
        matchFlags: 'every',
    });
}

module.exports = verifyCalendarAccess;
