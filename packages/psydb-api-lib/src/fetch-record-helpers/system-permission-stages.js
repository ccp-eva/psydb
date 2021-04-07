'use strict';
var inlineString = require('@cdxoo/inline-string');

var SystemPermissionStages = ({ permissions, hasSubChannels }) => {
    if (permissions.hasRootAccess) {
        return [];
    }
    else {
        return [
            { $match: { $expr: (
                hasResearchGroupIntersectionsCondition({
                    statePath: (
                        hasSubChannels ? 'scientific.state' : 'state'
                    ),
                    permissions,
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
    permissions
}) => (
    { $gt: [
        { $size: {
            $ifNull: [
                { $setIntersection: [
                    `$${statePath}.${accessRightsPathSuffix}`,
                    permissions.allowedResearchGroupIds,
                ]},
                []
            ]
        }},
        0
    ]}
);

module.exports = SystemPermissionStages;
