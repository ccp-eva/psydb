'use strict';
var inline = require('@cdxoo/inline-text');

var makeTestingPermissionSubConditions = ({
    researchGroupIds,
    experimentVariant
}) => {
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
    )
    
    //console.dir({ subConditions }, { depth: null });
    return subConditions;
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

module.exports = makeTestingPermissionSubConditions;
