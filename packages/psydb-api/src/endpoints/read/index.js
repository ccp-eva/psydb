'use strict';
var debug = require('debug')('psydb:api:endpoints:self');

var inlineString = require('@cdxoo/inline-string');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var read = async (context, next) => {
    var { 
        db,
        permissions,
        params,
        query,
    } = context;

    // TODO: check param format

    if (
        !permissions.hasRootAccess
        && !permissions.canReadCollection(params.collectionName)
    ) {
        throw new ApiError(403, 'CollectionAccessDenied');
    }

    //console.dir(addSystemPermissionStages({ permissions }), { depth: null });

    var resultSet = await (
        db.collection(params.collectionName).aggregate([
            { $match: {
                _id: params.id
            }},
            ...SystemPermissionStages({ permissions }),
        ]).toArray()
    );

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    
    if (resultSet.length < 1 ) {
        throw new ApiError(404, 'NoAccessibleRecordFound');
    }

    console.dir(resultSet, { depth: null });

    await next();
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

var SystemPermissionStages = ({ permissions }) => {
    if (permissions.hasRootAccess) {
        return [];
    }
    else {
        return [
            { $match: { $expr: {
                $or: [
                    hasResearchGroupIntersectionsCondition({
                        statePath: 'state',
                        permissions,
                    }),
                    hasResearchGroupIntersectionsCondition({
                        statePath: 'scientific.state',
                        permissions,
                    }),
                ]
            }}}
        ]
    }
}

module.exports = read;
