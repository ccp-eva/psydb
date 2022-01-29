export const SystemPermissions = (options) => {
    var { permissions } = options;
    var {
        forcedResearchGroupId,
        researchGroupIds,
    } = permissions.raw;

    var firstResearchGroupId = undefined;
    if (Array.isArray(researchGroupIds)) {
        firstResearchGroupId = researchGroupIds[0];
    }
    var presetResearchGroupId = (
        forcedResearchGroupId ||
        firstResearchGroupId ||
        undefined
    );

    return {
        accessRightsByResearchGroup: [{
            researchGroupId: presetResearchGroupId,
            permission: presetResearchGroupId ? 'write' : undefined,
        }],
        isHiddenForResearchGroupIds: [],
    }
}
