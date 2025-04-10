'use strict';
var { MongoClient } = require('mongodb');
var { ejson } = require('@mpieva/psydb-core-utils');

var WrappedCache = require('../../wrapped-cache');
var prepareCache = require('./prepare-cache');

var subjectCRTs = [
    { type: 'bonobo' },
    { type: 'chimpanzee' },
    { type: 'gorilla' },
    { type: 'orang_utan' },
];

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
    await prepareCache({ db, cache });

    var ix = 0;
    for (var it of subjectCRTs) {
        var type = 'wkprc_' + it.type;
        
        await createUnknownParent({
            apiKey, driver, type, cache, ix, biologicalGender: 'female',
        });
        ix += 1;
        
        await createUnknownParent({
            apiKey, driver, type, cache, ix, biologicalGender: 'male',
        });
        ix += 1;
    }
    
    mongo.close();
}

var createUnknownParent = async (bag) => {
    var { apiKey, driver, cache, type, ix } = bag;
    var researchGroupId = String(cache.get('/researchGroup/WKPRC'));

    await driver.sendMessage({
        type: `subject/${type}/create`,
        payload: {
            id: String(ix).padStart(24, '0'),
            sequenceNumber: '0',
            isDummy: true,
            props: {
                gdpr: { custom: {}},
                scientific: {
                    custom: {
                        name: 'Unknown',
                        biologicalGender: 'unknown',
                        wkprcIdCode: '-',
                        dateOfBirth: null,
                        subSpeciesId: null,
                        motherId: null,
                        fatherId: null,
                        groupId: null,
                        rearingHistoryId: null,
                        originId: null,
                        arrivalDate: null,
                        arrivedFrom: '',
                        locationId: null,
                        sensitive_comment: '',
                    },
                    comment: 'dummy ape to be used when parent is unknown',
                    systemPermissions: {
                        isHidden: false,
                        accessRightsByResearchGroup: [
                            { researchGroupId, permission: 'write' }
                        ]
                    }
                }
            }},
    }, { apiKey });
}
