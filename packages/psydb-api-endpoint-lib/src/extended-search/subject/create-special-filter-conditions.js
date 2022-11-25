'use strict';
var {
    timeshiftAgeFrame
} = require('@mpieva/psydb-common-lib');

var {
    hasSubjectParticipatedIn
} = require('@mpieva/psydb-mongo-stages').expressions;

var {
    createCustomQueryValues,
    convertPointerKeys,
    escapeRX // FIXME: use makeRX
} = require('../utils');

var createSpecialFilterConditions = (filters) => {
    var {
        subjectId,
        onlineId,
        sequenceNumber,
        didParticipateIn,
        didNotParticipateIn,
        hasTestingPermission,
        isHidden,
        comment,
    } = filters;

    var AND = [];
    if (subjectId) {
        AND.push({
            '_id': new RegExp(escapeRX(subjectId), 'i')
        });
    }
    if (onlineId) {
        AND.push({
            'onlineId': new RegExp(escapeRX(onlineId), 'i')
        });
    }
    if (sequenceNumber !== undefined) {
        AND.push({ $expr: {
            $regexMatch: {
                input: { $convert: {
                    input: '$sequenceNumber', to: 'string'
                }},
                regex: new RegExp(escapeRX(String(sequenceNumber)), 'i')
            }
        }});
    }
    if (didParticipateIn && didParticipateIn.length > 0) {
        AND.push({ $expr: (
            hasSubjectParticipatedIn({ studyIds: didParticipateIn })
        )});
    }
    if (didNotParticipateIn && didNotParticipateIn.length > 0) {
        AND.push({ $expr: { $not: (
            hasSubjectParticipatedIn({ studyIds: didNotParticipateIn })
        )}});
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
        AND.push(convertPointerKeys(statics));
    }

    return (
        AND.length > 0
        ? { $and: AND }
        : undefined
    )
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
