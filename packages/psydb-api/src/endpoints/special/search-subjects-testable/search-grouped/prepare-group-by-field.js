'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareGroupByField = (bag) => {
    var {
        labProcedureSettingRecords,
        subjectTypeRecord
    } = bag;

    var subjectLocationFieldPointer = undefined;
    for (var it of labProcedureSettingRecords) {
        var { studyId, state } = it;
        var { subjectLocationFieldPointer: current } = state;
        if (subjectLocationFieldPointer === undefined) {
            subjectLocationFieldPointer = current;
        }
        else if (subjectLocationFieldPointer !== current) {
            throw new ApiError(400, {
                apiStatus: 'SubjectLocationFieldConflict',
                data: {
                    studyId,
                    expected: subjectLocationFieldPointer,
                    actual: current,
                }
            });
        }
    }
    
    var customFields = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
    );

    var groupByField = customFields.find(field => (
        field.pointer === subjectLocationFieldPointer
    ));

    return groupByField;
}

module.exports = prepareGroupByField;
