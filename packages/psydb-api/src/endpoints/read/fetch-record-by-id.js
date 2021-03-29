'use strict';
var debug = require('debug')('psydb:api:endpoints:read');

var inlineString = require('@cdxoo/inline-string');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var fetchRecordById = async ({
    db,
    collectionName,
    permissions,
    hasSubChannels,
    id,
}) => {
    var resultSet = await (
        db.collection(collectionName).aggregate([
            { $match: {
                _id: id
            }},
            ...SystemPermissionStages({ permissions, hasSubChannels }),
        ]).toArray()
    );

    return resultSet[0];
}

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

module.exports = fetchRecordById;
