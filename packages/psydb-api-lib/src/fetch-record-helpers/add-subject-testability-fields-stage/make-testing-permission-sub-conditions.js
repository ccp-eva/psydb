'use strict';
var inline = require('@cdxoo/inline-text');

var makeTestingPermissionSubConditions = ({
    researchGroupIds,
    experimentVariant
}) => {
    /*var inputField = {
        'inhouse': 'canBeTestedInhouse',
        'away-team': 'canBeTestedByAwayTeam',
        'online-video-call': 'canBeTestedInOnlineVideoCall',
        //'online-survey': 'canBeTestedInOnlineSurvey',
        'online-survey': 'canBeTestedOnline',
    }[experimentVariant];

    if (!inputField) {
        throw new Error(inline`
            experimentVariant should be one of
            ['inhouse', 'away-team', 'online'] but
            "${experimentVariant}" was given
        `)
    }*/

    var inputPath = `$scientific.state.testingPermissions`;

    var subConditions = (
        // is the child allowed to be tested by the studies researchgroups
        // we currently require at least one group
        researchGroupIds.map(groupId => (
            ItemsExistExpr({
                inputPath,
                as: 'group',
                cond: { $and: [
                    { $eq: [ '$$group.researchGroupId', groupId ]},
                    ItemsExistExpr({
                        inputPath: '$$group.permissionList',
                        as: 'perm',
                        cond: { $and: [
                            { $eq: [
                                '$$perm.labProcedureTypeKey',
                                experimentVariant
                            ]},
                            { $eq: [ '$$perm.value', 'yes' ]}
                        ]}
                    })
                ]}
            })
        ))
        /*researchGroupIds.map(groupId => ({
            $gt: [
                { $size: {
                    $filter: {
                        input: inputPath,
                        as: 'item',
                        cond: { $and: [
                            { $eq: [ '$$item.researchGroupId', groupId ]},
                            { $gt: [
                                { $size: {
                                    $filter: {
                                        input: '$$item.permissionList',
                                        as: 'perm',
                                        cond: { $and: [
                                            { $eq: { '$$perm.labOperationType'}}
                                        ]}
                                    }
                                }},
                                0
                            ]}
                    //{ $eq: [ '$$item.permissionList', 'yes' ]}
                        ]}
                    }
                }},
                0,
            ]
        }))*/
    )
    
    console.dir({ subConditions }, { depth: null });
    return subConditions;
}

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

module.exports = makeTestingPermissionSubConditions;
