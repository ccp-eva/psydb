'use strict';
var { MongoClient } = require('mongodb');
var { ejson } = require('@mpieva/psydb-core-utils');
var WrappedCache = require('../../wrapped-cache');

var prepareCache = require('./prepare-cache');

var createEthnologySet = require('./create-ethnology-set');
var createLocationCRT = require('./create-location-crt');
var createSubjectCRT = require('./create-subject-crt');
var createFSScientistRole = require('./create-fs-scientist-role');
var createResearchGroup = require('./create-research-group');

var sites = [
    { type: 'argentina', labelDE: 'Argentinien', labelEN: 'Argentina' },
    { type: 'mexico', labelDE: 'Mexiko', labelEN: 'Mexico' },
    { type: 'newzeeland', labelDE: 'Neuseeland', labelEN: 'New Zeeland' },
    { type: 'nigeria', labelDlE: 'Nigeria', labelEN: 'Nigeria' },
    { type: 'zambia', labelDE: 'Sambia', labelEN: 'Zambia' }
];
var defaultSubjectFormOrder = [
    '/sequenceNumber',
    '/gdpr/state/custom/name',
    '/scientific/state/custom/biologicalGender',
    '/scientific/state/custom/dateOfBirth',
    '/scientific/state/custom/isDateOfBirthReliable',
    '/scientific/state/custom/ethnologyId',
    '/scientific/state/custom/mainLocationId',
    '/scientific/state/comment',
]

module.exports = async (bag) => {
    var { driver, apiKey, extraOptions = {}} = bag;
    var { mongodb: mongodbConnectString } = extraOptions;
    if (!mongodbConnectString) {
        throw new Error('script requires mongodb connect string');
    }
    
    var mongo = await MongoClient.connect(
        mongodbConnectString,
        { useUnifiedTopology: true }
    );

    var db = mongo.db();

    var cache = WrappedCache({ driver });
    var context = { apiKey, driver, db, cache };
    await prepareCache(context);

    var systemRoleId = cache.get(`/systemRole/FS Scientist`);
    console.log({ systemRoleId });

    cache = cache.get();
    for (var site of sites) {
        var shared = { apiKey, driver, site };
        
        var ethnologySetId = await createEthnologySet({ ...shared });
        console.log({ ethnologySetId })
        
        var locationCrtId = await createLocationCRT({ ...shared });
        console.log({ locationCrtId })

        var subjectCrtId = await createSubjectCRT({
            ...shared,
            ethnologySetId,
            locationCrtId,
            formOrder: defaultSubjectFormOrder,
        });
        console.log({ subjectCrtId })

        cache[site.type] = {
            ethnologySetId,
            locationCrtId,
            subjectCrtId,
        };
    }
    
    for (var site of sites) {
        var shared = { apiKey, driver, site };
        var {
            ethnologySetId,
            locationCrtId,
            subjectCrtId,
        } = cache[site.type];
        
        var researchGroupId = await createResearchGroup({
            ...shared,
            systemRoleId,
            ethnologySetId,
        });
        console.log({ researchGroupId })
        
        cache[site.type] = {
            ...cache[site.type],
            researchGroupId,
        };
    }

    mongo.close();

    console.dir(ejson(
        driver.getCache().lastChannelIds
    ), { depth: null });
}
