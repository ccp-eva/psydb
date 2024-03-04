'use strict';
var { MongoClient } = require('mongodb');
var {
    ejson, keyBy, entries, only, omit
} = require('@mpieva/psydb-core-utils');

var WrappedCache = require('../../wrapped-cache');
var prepareCache = require('./prepare-cache');


var subjects = [
    { type: 'chimpanzee', label: 'Chimpanzee' },
    { type: 'bonobo', label: 'Bonobo' },
    { type: 'gorilla', label: 'Gorilla' },
    { type: 'orang_utan', label: 'Orang-Utan' },
];

var jsonify = (that) => JSON.parse(JSON.stringify(that));

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

    for (var it of subjects) {
        await createSubjectGroups({
            ...context, type: `wkprc_${it.type}`,
        });
        await updateSubjects({
            ...context, type: `wkprc_${it.type}`
        })
    }
 
    mongo.close();
}

var createGroupKeyForSubject = (subject) => ([
    subject.type,
    subject.scientific.state.custom.locationId,
    subject.scientific.state.custom.group
].join(':::'));

var createGroupKeyForGroup = (group) => ([
    group.subjectType,
    group.state.locationId,
    group.state.name
].join(':::'));

var createSubjectGroups = async (bag) => {
    var { db, apiKey, driver, cache, type } = bag;
    var researchGroupId = cache.get('/researchGroup/WKPRC');
    
    var subjects = await (
        db.collection('subject').find({ type }).toArray()
    );

    var existingGroups = await (
        db.collection('subjectGroup').find({ subjectType: type }).toArray()
    );
    var keyedExistingGroups = keyBy({
        items: existingGroups,
        createKey: createGroupKeyForGroup
    });

    var subjectGroupMapping = {};
    for (var it of subjects) {
        var groupKey = createGroupKeyForSubject(it);
        
        var {
            locationId,
            group: groupName
        } = it.scientific.state.custom;

        if (!locationId || !groupName) {
            continue;
        }
        
        // NOTE: in case we already have some
        if (keyedExistingGroups[groupKey]) {
            groupId = keyedExistingGroups[groupKey]._id;
        }
        else {

            var locationType = cache.get(`/location/${locationId}`).type;

            // create group
            await driver.sendMessage({
                type: 'subjectGroup/create',
                payload: {
                    subjectType: type,
                    props: {
                        locationType,
                        locationId,
                        name: groupName,
                        comment: '',
                        systemPermissions: {
                            isHidden: false,
                            accessRightsByResearchGroup: [
                                { researchGroupId, permission: 'write' }
                            ]
                        }
                    }
                },
            }, { apiKey });

            var groupId = cache.addId({
                collection: 'subjectGroup',
                as: groupKey
            });

            keyedExistingGroups[groupKey] = { _id: groupId };
        }

        subjectGroupMapping[it._id] = groupId;
    }

    cache.merge({
        [type]: {
            subjects,
            subjectGroupMapping,
        }
    })
}

var updateSubjects = async (bag) => {
    var { db, apiKey, driver, cache, type } = bag;
    var { subjects, subjectGroupMapping } = cache.get(type);
    
    var subjectsById = keyBy({
        items: subjects,
        byProp: '_id'
    });

    for (var [ subjectId, groupId ] of entries(subjectGroupMapping)) {
        var subject = subjectsById[subjectId];
        if (!subject.scientific.state.custom.groupId) {
            await driver.sendMessage({
                type: 'subject/wkprc_chimpanzee/patch',
                payload: { id: subject._id, props: {
                    gdpr: { custom: {}},
                    scientific: {
                        custom: {
                            ...omit({
                                from: subject.scientific.state.custom,
                                paths: [ 'knownOffspringIds' ]
                            }),
                            groupId,
                        },

                        ...only({ from: subject.scientific.state, paths: [
                            'comment',
                            'systemPermissions'
                        ]})
                    }
                }},
            }, { apiKey });
        }
    }
}
