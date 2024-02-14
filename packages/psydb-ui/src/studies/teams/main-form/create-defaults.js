export const createDefaults = (bag = {}) => {
    var { researchGroupIds = [] } = bag;
    return {
        personnelIds: [],
        color: '#ff0000',
        hidden: false,
        ...(researchGroupIds?.length === 1 && {
            researchGroupId: researchGroupIds[0]
        })
    }
}
