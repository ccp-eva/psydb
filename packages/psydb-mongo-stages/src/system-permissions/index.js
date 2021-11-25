'use strict';
var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var collectionHasSubChannels = (collection) => (
    allSchemaCreators[collection].hasSubChannels
)

var SystemPermissionStages = (options) => {
    var {
        permissions,
        collection,
        action = 'read',
    } = options;

    if (!permissions) {
        throw new Error('option "permissions" required');
    }
    if (!collection) {
        throw new Error('option "collection" required');
    }
    if (!['read', 'write'].includes(action)) {
        throw new Error(`unknown action "${action}"`);
    }

    var {
        hasRootAccess,
        forcedResearchGroupId,
        //projectedResearchGroupIds,
        researchGroupIdsByCollection,
    } = permissions

    if (hasRootAccess && !forcedResearchGroupId) {
        return [];
    }
    else {
        var allowedResearchGroupIds = (
            researchGroupIdsByCollection[collection][action]
        );

        var statePath = (
            collectionHasSubChannels(collection)
            ? 'scientific.state'
            : 'state'
        );

        var stages = [
            { $match: { $or: [
                // NOTE: we have collections that do not have
                // record based systempermissions but instead
                // only require collection access
                { [`${statePath}.systemPermissions`]: { $exists: false }},
                { $expr: (
                    hasResearchGroupIntersectionsCondition({
                        statePath,
                        allowedResearchGroupIds,
                        requiredPermission: action,
                    })
                )}
            ]}}
        ];

        return stages;
    }
}


var hasResearchGroupIntersectionsCondition = ({
    statePath,
    allowedResearchGroupIds,
    requiredPermission,
}) => {
    return (
        { $gt: [
            { $size: {
                $ifNull: [
                    { $setIntersection: [
                        FilterAndMapAccessRightsExpression({
                            statePath,
                            requiredPermission
                        }),
                        allowedResearchGroupIds,
                    ]},
                    []
                ]
            }},
            0
        ]}
    )
};

var FilterAndMapAccessRightsExpression = ({
    statePath,
    requiredPermission
}) => {
    var expr = (
        { $map: {
            input: { $filter: {
                input: inlineString`
                $${statePath}
                .systemPermissions
                .accessRightsByResearchGroup
            `,
                cond: { $in: [
                    '$$this.permission',
                    requiredPermission === 'read'
                    ? [ 'read', 'write' ]
                    : [ 'write' ]
                ]}
            }},
            in: '$$this.researchGroupId'
        }}
    );

    return expr;
}

module.exports = { SystemPermissionStages };
