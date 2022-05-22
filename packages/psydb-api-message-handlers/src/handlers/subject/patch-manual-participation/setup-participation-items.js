'use strict';
var findParticipation = require('./find-participation');

var setupParticipationItems = (context) => {
    var { message, cache } = context;
    var { payload } = message;
    var {
        participationId,

        labProcedureType,
        studyId,
        subjectId,
        locationId,

        timestamp,
        status,
        
        experimentOperatorTeamId,
        experimentOperatorIds,
    } = payload;

    var { study, subject, location } = cache;

    var [ pix, originalItem ] = findParticipation({
        subject, participationId, as: 'entry'
    });

    var participationItem = {
        ...(
            originalItem.type === 'manual'
            ? { type: 'manual', realType: labProcedureType }
            : { type: labProcedureType }
        ),

        studyId,
        studyType: study.type,

        timestamp,
        status,
    
        // TODO
        //excludeFromMoreExperimentsInStudy: false
    }
    
    if (labProcedureType !== 'online-survey') {
        participationItem = {
            ...participationItem,
            locationId,
            locationType: location.type,
        }

        if (experimentOperatorTeamId) {
            var { experimentOperatorTeam } = cache;
            var { personnelIds, color } = experimentOperatorTeam.state;
            
            participationItem = {
                ...participationItem,
                //experimentOperatorTeamId,
                //experimentOperatorTeamColor: color,
                experimentOperatorIds: personnelIds
            }
        }
        else {
            participationItem = {
                ...participationItem,
                experimentOperatorIds,
            }
        }
    }

    var patchedItem = { ...originalItem, ...participationItem };

    cache.pix = pix;
    cache.originalItem = originalItem;
    cache.patchedItem = patchedItem;
}

module.exports = setupParticipationItems
