'use strict';
var datefns = require('date-fns');
var { makeRX, timeshiftAgeFrame } = require('@mpieva/psydb-common-lib');

var {
    hasSubjectParticipatedIn
} = require('@mpieva/psydb-mongo-stages').expressions;

var { createCustomQueryValues } = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        subjectId,
        onlineId,
        sequenceNumber,

        mergedDuplicateId,
        mergedDuplicateOnlineId,
        mergedDuplicateSequenceNumber,

        didParticipateIn,
        didNotParticipateIn,
        participationInterval,
        hasTestingPermission,
        isHidden,
        comment,
    } = filters;

    var AND = [];

    addBaseIdConditions(AND, filters);
    addMergedDuplicateConditions(AND, filters);

    if (didParticipateIn && didParticipateIn.length > 0) {
        AND.push({ $expr: (
            hasSubjectParticipatedIn({
                studyIds: didParticipateIn,
                ...(participationInterval && {
                    interval: participationInterval
                })
            })
        )});
    }
    if (didNotParticipateIn && didNotParticipateIn.length > 0) {
        AND.push({ $expr: { $not: (
            hasSubjectParticipatedIn({ studyIds: didNotParticipateIn })
        )}});
    }
    if (participationInterval?.start || participationInterval?.end) {
        var PATH = '$scientific.state.internals.participatedInStudies';
        AND.push({ $expr: {
            $gt: [ { $size: { $filter: {
                input: PATH,
                cond: { $and: [
                    { $in: [ '$$this.status', [ 'participated' ]] },
                    { $and: [
                        ...(participationInterval.start ? [
                            { $gte: [
                                '$$this.timestamp',
                                participationInterval.start
                            ]}
                        ] : []),
                        ...(participationInterval.end ? [
                            { $lte: [
                                '$$this.timestamp',
                                datefns.endOfDay(participationInterval.end)
                            ]}
                        ] : [])
                    ]}
                ]}}
            }}, 0 ]
        }});
    }

    var { labMethod, researchGroupId } = (hasTestingPermission || {});
    if (
        labMethod || researchGroupId
    ) {
        AND.push({ $expr: ItemsExistExpr({
            inputPath: '$scientific.state.testingPermissions',
            as: 'group',
            cond: { $and: [
                ...(researchGroupId ? [
                    { $eq: [
                        '$$group.researchGroupId',
                        hasTestingPermission.researchGroupId
                    ]}
                ] : []),
                ItemsExistExpr({
                    inputPath: '$$group.permissionList',
                    as: 'perm',
                    cond: { $and: [
                        ...(labMethod ? [
                            { $eq: [
                                '$$perm.labProcedureTypeKey',
                                hasTestingPermission.labMethod
                            ]}
                        ] : []),
                        { $eq: [ '$$perm.value', 'yes' ]}
                    ]}
                })
            ]}
        })})
    }
    
    var statics = createCustomQueryValues({
        fields: [
            {
                key: 'comment',
                pointer: '/scientific/state/comment',
                type: 'FullText'
            },
            {
                key: 'isHidden',
                pointer: '/scientific/state/systemPermissions/isHidden',
                type: 'DefaultBool'
            },
        ],
        filters,
    });
    if (Object.keys(statics).length > 0 ) {
        AND.push(statics);
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
}

var addBaseIdConditions = (AND, filters) => {
    var {
        subjectId,
        onlineId,
        sequenceNumber,
    } = filters;

    if (subjectId) {
        AND.push({ '_id': makeRX(subjectId) });
    }
    if (onlineId) {
        AND.push({ 'onlineId': makeRX(onlineId) });
    }
    if (sequenceNumber !== undefined) {
        AND.push({ $expr: {
            $regexMatch: {
                input: { $convert: {
                    input: '$sequenceNumber', to: 'string'
                }},
                regex: makeRX(String(sequenceNumber)),
            }
        }});
    }
}

var addMergedDuplicateConditions = (AND, filters) => {
    var {
        mergedDuplicateId,
        mergedDuplicateOnlineId,
        mergedDuplicateSequenceNumber,
    } = filters;
    
    var prefix = 'scientific.state.internals.mergedDuplicates';
    if (mergedDuplicateId) {
        AND.push({ [`${prefix}._id`]: (
            makeRX(mergedDuplicateId)
        )});
    }
    if (mergedDuplicateOnlineId) {
        AND.push({ [`${prefix}.onlineId`]: (
            makeRX(mergedDuplicateOnlineId)
        )});
    }
    if (mergedDuplicateSequenceNumber) {
        AND.push({ [`${prefix}.sequenceNumber`]: (
            makeRX(mergedDuplicateSequenceNumber)
        )});
    }
}


// FIXME: move to mongo-stages
var ItemsExistExpr = ({
    inputPath,
    as,
    cond
}) => ({
    $gt: [
        { $size: {
            $filter: {
                input: inputPath,
                as,
                cond
            }
        }},
        0,
    ]
})

module.exports = createSpecialFilterConditions;
