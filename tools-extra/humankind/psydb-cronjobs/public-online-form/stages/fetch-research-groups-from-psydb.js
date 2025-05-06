'use strict';
var fetchResearchGroupsFromPsydb = async (context, next) => {
    var { driver } = context;

    var fetched = await driver.get({ url: '/self' });
    var { permissions } = fetched.data.data;
    var { researchGroupIds } = permissions;

    context.researchGroupIds = researchGroupIds;

    await next();
}

module.exports = { fetchResearchGroupsFromPsydb }
