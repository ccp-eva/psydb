export const SystemPermissions = (options) => {
    var {
        permissions,
        noPreset = false
    } = options;

    if (noPreset) {
        return {
            accessRightsByResearchGroup: [],
            isHidden: false,
        }
    }

    // FIXME: use permissions.getResearchGroupIds()
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
            permission: 'write'
        }],
        isHidden: false,
    }
}
