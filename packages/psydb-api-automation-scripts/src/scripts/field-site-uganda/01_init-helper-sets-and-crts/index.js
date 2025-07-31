'use strict';
var WrappedCache = require('../../../wrapped-cache');

var createHelperSets = require('./create-helper-sets');
var createVillageCRT = require('./create-village-crt');
var createSchoolCRT = require('./create-school-crt');
var createSubjectCRT = require('./create-subject-crt');

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var cache = WrappedCache({ driver });
    var context = { driver, cache };

    await createHelperSets(context);

    await createVillageCRT(context);
    await createSchoolCRT(context);
    await createSubjectCRT(context);
}
