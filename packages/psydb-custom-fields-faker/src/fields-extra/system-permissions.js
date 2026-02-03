'use strict';
var { ForeignIdList } = require('../fields');

var getRandomValue = (bag) => {
    var { fromStore, count } = bag;

    // FIXME: respect definition
    var researchGroupIds = ForeignIdList.getRandomValue({
        definition: { props: {
            collection: 'researchGroup', minItems: 1
        }}, count, fromStore,
    });

    var accessRightsByResearchGroup = [];
    for (var id of researchGroupIds) {
        accessRightsByResearchGroup.push({
            researchGroupId: id,
            permission: 'write', // TODO: maybe random
        })
    }

    var out = {
        accessRightsByResearchGroup,
        isHidden: false, // TODO: maybe random?
    }

    return out;
}

module.exports = {
    getRandomValue
}
