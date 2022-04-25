'use strict';
var gatherLocationsFromLabProcedureSettings = ({ settingRecords }) => {
    var gathered = {};
    for (var setting of settingRecords) {
        if (!['inhouse', 'inhouse-group-simple', 'online-video-call'].includes(setting.type)) {
            continue;
        }

        var { locations } = setting.state;
        for (var it of locations) {
            var { customRecordTypeKey, locationId } = it;
            if (!gathered[customRecordTypeKey]) {
                gathered[customRecordTypeKey] = [];
            }
            gathered[customRecordTypeKey].push(locationId)
        }
    }
    return gathered;
}

module.exports = gatherLocationsFromLabProcedureSettings; 
