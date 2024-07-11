'use strict';
var { only, keyBy } = require('@mpieva/psydb-core-utils');
var { createId } = require('@mpieva/psydb-api-lib');

var setupBaseExperimentState = async (context, next) => {
    var { message, cache } = context;
    var { timestamp, studyId } = message.payload;

    var seriesId = await createId();

    var experimentState = {
        seriesId,
        isPostprocessed: true,

        studyId,
        studyRecordType: cache.get('study').type,
        interval: { start: timestamp, end: timestamp },
    }

    cache.merge({ experimentState });
    await next();
}

var addSubjectState = async (context, next) => {
    var { message, cache } = context;
    var { experimentState, subjects } = cache.get();
    var { subjectData } = message.payload;

    var subjectTypesById = keyItemTypesById(subjects);

    experimentState = {
        ...experimentState,
        selectedSubjectIds: subjectData.map(it => it.subjectId),
        subjectData: subjectData.map(({ status, ...rest }) => ({
            invitationStatus: 'scheduled',
            participationStatus: status || 'didnt-participate',
            excludeFromMoreExperimentsInStudy: false,
            comment: '',
            
            subjectType: subjectTypesById[rest.subjectId],
            ...rest
        }))
    }
    
    cache.merge({ experimentState });
    await next();
}

var addLocationAndOperatorState = async (context, next) => {
    var { message, cache } = context;
    var { labOperatorIds } = message.payload;
    var { experimentState, labTeam, location } = cache.get();

    var color = '#000000';
    if (labTeam) {
        ({ color, personnelIds: labOperatorIds } = labTeam.state);
        experimentState.experimentOperatorTeamId = labTeam._id
    }
    
    experimentState = {
        ...experimentState,
        color,
        experimentOperatorIds: labOperatorIds,
        locationId: location._id,
        locationRecordType: location.type,
    }
    
    cache.merge({ experimentState });
    await next();
}

var addApestudiesWKPRCDefaultExtraState = async (context, next) => {
    var { message, cache } = context;
    var { experimentState } = cache.get();
    
    var pass = only({ from: message.payload, keys: [
        'subjectGroupId', 'experimentName', 'roomOrEnclosure',
        'intradaySeqNumber', 'totalSubjectCount',
    ]})
    var { subjectGroupId } = pass; 

    experimentState = {
        ...experimentState,
        ...pass,
        subjectData: experimentState.subjectData.map(it => ({
            ...it, subjectGroupId
        }))
    };

    cache.merge({ experimentState })

    await next();
}

var dispatchCreate = async (context, next) => {
    var { message, cache, dispatchProps } = context;
    var { labMethod } = message.payload;
    var experimentId = await createId('experiment');
    
    var experimentCore = {
        type: 'manual',
        realType: labMethod,
    };

    await dispatchProps({
        collection: 'experiment',
        channelId: experimentId,
        isNew: true,
        additionalChannelProps: experimentCore,
        props: cache.get('experimentState'),

        initialize: true,
        recordType: experimentCore.type,
    });

    cache.merge({ experimentId });
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
    setupBaseExperimentState,
    addSubjectState,
    addLocationAndOperatorState,
    addApestudiesWKPRCDefaultExtraState,
    dispatchCreate
}
