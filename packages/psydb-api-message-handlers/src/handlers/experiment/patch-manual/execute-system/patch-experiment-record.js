'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');
var { only, keyBy } = require('@mpieva/psydb-core-utils');

var compose_createExperimentRecord = () => compose([
    setupExperimentStateUpdate,
    replaceSubjectState,

    switchComposition({
        // XXX does cache work with switchComposition?
        // => no; see ticket
        by: '/cache/_internal/labMethod',
        branches: {
            'inhouse': [ 
                replaceLocationAndOperatorState,
            ],
            'online-video-call': [ 
                replaceLocationAndOperatorState,
            ],
            'away-team': [
                replaceOperatorState,
            ],
            'apestudies-wkprc-default': [
                replaceLocationAndOperatorState,
                replaceApestudiesWKPRCDefaultExtraState,
            ],
            'manual-only-participation': [
                replaceLocationAndOperatorState,
            ],
            'online-survey': []
        }
    }),

    dispatchUpdate
])

var setupExperimentStateUpdate = async (context, next) => {
    var { message, cache } = context;
    var { experiment } = cache.get();
    var { timestamp, interval } = message.payload;

    var experimentUpdate = {
        interval: (
            interval
            ? interval
            : { start: timestamp, end: timestamp } // FIXME: duration end
        )
    }

    cache.merge({ experimentUpdate });
    await next();
}

var replaceSubjectState = async (context, next) => {
    var { message, cache } = context;
    var { experimentUpdate, subjects, experiment } = cache.get();
    var { subjectData } = message.payload;

    var originalSubjectDataById = keyBy({
        items: experiment.state.subjectData,
        byProp: 'subjectId'
    });

    var subjectTypesById = keyItemTypesById(subjects);

    experimentUpdate = {
        ...experimentUpdate,
        selectedSubjectIds: subjectData.map(it => it.subjectId),
        subjectData: subjectData.map(({ subjectId, status, ...newData }) => {
            var original = originalSubjectDataById[subjectId];
            if (original) {
                return {
                    ...original,
                    ...newData,
                    participationStatus: status || 'didnt-participate',
                }
            }
            else {
                return {
                    invitationStatus: 'scheduled',
                    excludeFromMoreExperimentsInStudy:  false,
                    comment: '',
                    
                    participationStatus: status || 'didnt-participate',
                    subjectType: subjectTypesById[subjectId],
                    subjectId,
                    ...newData
                }
            }
        })
    }
    
    cache.merge({ experimentUpdate });
    await next();
}

var replaceLocationAndOperatorState = async (context, next) => {
    var { message, cache } = context;
    var { labOperatorIds } = message.payload;
    var { experimentUpdate, location } = cache.get();

    experimentUpdate = {
        ...experimentUpdate,
        experimentOperatorIds: labOperatorIds,
        locationId: location._id,
        locationRecordType: location.type,
    }
    
    cache.merge({ experimentUpdate });
    await next();
}

var replaceOperatorState = async (context, next) => {
    var { message, cache } = context;
    var { labOperatorIds } = message.payload;
    var { experimentUpdate } = cache.get();

    experimentUpdate = {
        ...experimentUpdate,
        experimentOperatorIds: labOperatorIds,
    }
    
    cache.merge({ experimentUpdate });
    await next();
}
var replaceApestudiesWKPRCDefaultExtraState = async (context, next) => {
    var { message, cache } = context;
    var { experimentUpdate } = cache.get();

    var pass = only({ from: message.payload, keys: [
        'subjectGroupId',
        'experimentName', 'conditionName', 'roomOrEnclosure',
        'intradaySeqNumber', 'totalSubjectCount',
    ]})
    var { subjectGroupId } = pass; 

    experimentUpdate = {
        ...experimentUpdate,
        ...pass,
        subjectData: experimentUpdate.subjectData.map(it => ({
            ...it, subjectGroupId
        }))
    };

    cache.merge({ experimentUpdate })

    await next();
}

var dispatchUpdate = async (context, next) => {
    var { message, cache, dispatchProps } = context;
    var { experimentUpdate } = cache.get();
    var { experimentId } = message.payload;
    
    await dispatchProps({
        collection: 'experiment',
        channelId: experimentId,
        props: experimentUpdate,
    });

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

module.exports = compose_createExperimentRecord();
