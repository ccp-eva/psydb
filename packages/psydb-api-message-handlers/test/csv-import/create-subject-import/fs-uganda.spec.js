'use strict';
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { KOA_BODYDATA } = require('@mpieva/psydb-api-mocha-test-tools/utils');

var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit, without } = require('@mpieva/psydb-core-utils');
var { ApiError, aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

describe('csv-import/subject/create-default fs-uganda', function () {

    var subjectType = 'fs_uganda_subject';
    var researchGroupId = ObjectId("6861fcb19e48252d4dcb73f7");

    var db, ids, send;
    beforeEach(async function () {
        ids = await this.restore([
            '2025-09-17__0731'
        ], { gatherIds: true });
        
        db = this.getDbHandle();
        ([ send ] = this.createMessenger({
            login: { email: 'root@example.com' }
        }));

    });

    it('full import w/o parentIds', async function () {
        console.log(ids.all());
        var { _id: fileId } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-full'),
        });

        var deltas = BaselineDeltas();
        deltas.push(await fetchImportedSubjects({ db }));

        var { csvImportId } = await KOA_BODYDATA(send({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({ researchGroupId, subjectType, fileId })
        }));
        
        deltas.push(await fetchImportedSubjects({ db }));
        console.log(deltas.getCurrent());
        deltas.test({ expected: {
            '/0/_id': BaselineDeltas.AnyObjectId(),
            '/0/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/0/csvImportId': csvImportId,
            '/0/type': 'fs_uganda_subject',
            '/0/sequenceNumber': '3',
            '/0/isDummy': false,
            '/0/gdpr': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/custom/name': 'DummyKind01',
            },
            '/0/scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/comment': '',
                'state/custom': {
                    'acquiredBy': ids(/Alice ChildLab/),
                    'biologicalGender': 'male',
                    'dateOfBirth': new Date('2024-08-12Z'),
                    'dateOfConsentForm': new Date('2025-01-01Z'),
                    'ethnicityIds': [ ids(/TestEthnicity01/) ],
                    'isDateOfBirthReliable': true,
                    'languageIds': [ ids(/TestLang01/), ids(/TestLang02/) ],
                    'localId': 'DK_001',
                    'schoolClassAtAcquisition': '4th Grade',
                    'schoolId': ids(/TestSchool2/),
                    'villageId': ids(/TestVillage/)
                },
                'state/internals': BaselineDeltas.AnyObject(),
                'state/systemPermissions': BaselineDeltas.AnyObject(),
                'state/testingPermissions': BaselineDeltas.AnyArray(),
            },
            '/1/_id': BaselineDeltas.AnyObjectId(),
            '/1/_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
            '/1/csvImportId': csvImportId,
            '/1/type': 'fs_uganda_subject',
            '/1/sequenceNumber': '4',
            '/1/isDummy': false,
            '/1/gdpr': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/custom/name': 'DummyKind02',
            },
            '/1/scientific': {
                '_rohrpostMetadata': BaselineDeltas.AnyRohrpostMeta(),
                'state/comment': '',
                'state/custom': {
                    'acquiredBy': ids(/Bob ChildLab/),
                    'biologicalGender': 'male',
                    'dateOfBirth': new Date('2023-02-23Z'),
                    'dateOfConsentForm': new Date('2025-01-01Z'),
                    'ethnicityIds': [ ids(/TestEthnicity01/) ],
                    'isDateOfBirthReliable': true,
                    'languageIds': [ ids(/TestLang01/), ids(/TestLang02/) ],
                    'localId': 'DK_002',
                    'schoolClassAtAcquisition': '5th Grade',
                    'schoolId': ids(/TestSchool$/),
                    'villageId': ids(/TestVillage/)
                },
                'state/internals': BaselineDeltas.AnyObject(),
                'state/systemPermissions': BaselineDeltas.AnyObject(),
                'state/testingPermissions': BaselineDeltas.AnyArray(),
            },
        }, asFlatEJSON: true });

        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        console.ejson(subjects);
    });
    
    it('full import with parentIds', async function () {
        var { _id: fileIdBase } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-parent-ids'),
        });
        await send({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({
                researchGroupId, subjectType, fileId: fileIdBase
            })
        });
        
        var { _id: fileIdParents } = await this.createFakeFileUpload({
            db, buffer: loadCSV('subject-import/fs-uganda-parent-ids'),
        });
        var koaContext = await sendMessage({
            type: 'csv-import/subject/create-default',
            timezone: 'UTC',
            payload: jsonify({
                researchGroupId, subjectType, fileId: fileIdParents
            })
        });

        var { csvImportId } = koaContext.response.body.data;
        var subjects = await aggregateToArray({ db, subject: [
            { $match: { csvImportId }},
        ]});
        console.ejson(subjects);
    });
})

var fetchImportedSubjects = ({ db }) => (
    aggregateToArray({ db, subject: [
        { $match: {
            'csvImportId': { $exists: true }
        }}
    ]})
)
