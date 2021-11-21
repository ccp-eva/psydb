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
    } = options;

    if (!permissions) {
        throw new Error('option "permissions" required');
    }
    if (!collection) {
        throw new Error('option "collection" required');
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
            researchGroupIdsByCollection[collection].read
        );

        return [
            { $match: { $expr: (
                hasResearchGroupIntersectionsCondition({
                    statePath: (
                        collectionHasSubChannels(collection)
                        ? 'scientific.state'
                        : 'state'
                    ),
                    allowedResearchGroupIds,
                })
            )}}
        ]
    }
}


var accessRightsPathSuffix = inlineString`
    systemPermissions
    .accessRightsByResearchGroup
    .researchGroupId
`;

var hasResearchGroupIntersectionsCondition = ({
    statePath,
    allowedResearchGroupIds,
}) => {

    return (
        { $gt: [
            { $size: {
                $ifNull: [
                    { $setIntersection: [
                        `$${statePath}.${accessRightsPathSuffix}`,
                        allowedResearchGroupIds,
                    ]},
                    []
                ]
            }},
            0
        ]}
    )
};

module.exports = SystemPermissionStages;
