'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var { createId } = require('@mpieva/psydb-api-lib');

var explodeSubjectsToExperimentStates = async (context, next) => {
    var { message, cache } = context;
    var { studyId, subjectData } = message.payload;

    var seriesId = await createId();
    var subjectTypesById = keyItemTypesById(cache.get('subjects'));

    var experimentStateList = subjectData.map(it => {
        var {
            subjectId,
            status,
            timestamp,
            excludeFromMoreExperimentsInStudy,
            ...rest
        } = it;


        return {
            seriesId,
            isPostprocessed: true,

            studyId,
            studyRecordType: cache.get('study').type,
            interval: { start: timestamp, end: timestamp },
            selectedSubjectIds: [ subjectId ],
            subjectData: [
                {
                    subjectId,
                    subjectType: subjectTypesById[subjectId],
                    invitationStatus: 'scheduled',
                    participationStatus: status,
                    comment: '',
                    excludeFromMoreExperimentsInStudy,

                    ...rest
                }
            ]
        }
    })

    cache.merge({ experimentStateList });
    await next();
}

var addLocationAndOperatorState = async (context, next) => {
    var { message, cache } = context;
    var { labOperatorIds } = message.payload;
    var { experimentStateList, labTeam, location } = cache.get();

    experimentStateList = experimentStateList.map(it => {
        var color = '#000000';
        if (labTeam) {
            ({ color, personnelIds: labOperatorIds } = labTeam.state);
            it.experimentOperatorTeamId = labTeam._id
        }
        
        return {
            ...it,
            color,
            experimentOperatorIds: labOperatorIds,
            locationId: location._id,
            locationRecordType: location.type,
        }
    });
    
    cache.merge({ experimentStateList });
    await next();
}

var addApestudiesWKPRCDefaultExtraState = async (context, next) => {
    var { message, cache } = context;
    var { experimentStateList } = cache.get();
    
    var pass = only({ from: message.payload, keys: [
        'subjectGroupId', 'experimentName', 'roomOrEnclosure',
        'intradaySeqNumber', 'totalSubjectCount',
    ]})
    var { subjectGroupId } = pass; 
    var {
        subjectGroupId,
        experimentName,
        roomOrEnclosure,
    } = message.payload;

    experimentStateList = experimentStateList.map(state => {
        return {
            ...state,
            subjectGroupId,
            experimentName,
            roomOrEnclosure,
            subjectData: state.subjectData.map(it => ({
                ...it, subjectGroupId
            }))
        };
    });

    cache.merge({ experimentStateList })
    await next();
}

var dispatchCreates = async (context, next) => {
    var { message, cache, dispatchProps } = context;
    var { labMethod } = message.payload;
    var { experimentStateList } = cache.get();
    
    var experimentCore = {
        type: 'manual',
        realType: labMethod,
    };

    var experimentIdsByIndex = {};
    var experimentIdsBySubject = {};
    for (var [ ix, experimentState ] of experimentStateList.entries()) {
        var experimentId = await createId('experiment');
        experimentIdsByIndex[ix] = experimentId;

        for (var subjectData of experimentState.subjectData) {
            var { subjectId } = subjectData;
            experimentIdsBySubject[subjectId] = experimentId;
        }
    }

    
    for (var [ ix, experimentState ] of experimentStateList.entries()) {
        var experimentId = experimentIdsByIndex[ix];

        await dispatchProps({
            collection: 'experiment',
            channelId: experimentId,
            isNew: true,
            additionalChannelProps: experimentCore,
            props: experimentState,

            initialize: true,
            recordType: experimentCore.type,
        });
    }

    cache.merge({ experimentIdsBySubject });
    await next();
}

var keyItemTypesById = (items) => {
    var recordTypesByItemId = keyBy({
        items: items,
        byProp: '_id',
        transform: it => it.type
    });
    return recordTypesByItemId;
}

module.exports = {
    explodeSubjectsToExperimentStates,
    addLocationAndOperatorState,
    addApestudiesWKPRCDefaultExtraState,
    dispatchCreates
}
