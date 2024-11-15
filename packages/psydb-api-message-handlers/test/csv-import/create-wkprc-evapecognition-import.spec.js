'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');

var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-api-lib');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../src/');

describe.only('csv-import/experiment/create-wkprc-apestudies-default', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        //await this.restore('2024-04-03__0435_wkprc-and-fs');
        await this.restore('2024-07-12__0202_wkprc-fieldsite');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        //var file = await this.createFakeFileUpload({
        //    db, buffer: loadCSV('evapecognition/simple'),
        //});
        var file = await this.createFakeFileUpload({
            db, buffer: loadCSV(
                'experiment-csv/wkprc-apestudies-default/simple'
            ),
        });
        fileId = file._id;
    });

    it('does the thing', async function () {
        var studyId = ObjectId("6566b5c26c830cb226c1389b");
        var locationId = ObjectId("64d42de0443aa279ca4cb2e8");
        var subjectType = 'wkprc_chimpanzee';
        var labOperatorIds = [
            ObjectId("64d42ddf443aa279ca4cb2c9"),
            ObjectId("64d42ddf443aa279ca4cb2c5"),
        ];

        var koaContext = await sendMessage({
            type: 'csv-import/experiment/create-wkprc-apestudies-default',
            timezone: 'Europe/Berlin',
            payload: jsonify({
                subjectType,
                studyId,
                //locationId,
                fileId,
                //labOperatorIds
            })
        });

        var { csvImportId } = koaContext.response.body.data;
        console.log(csvImportId);

        var experiments = await aggregateToArray({ db, experiment: [
            { $match: { csvImportId }}
        ]});
        console.dir(ejson(experiments), { depth: null });
        
        return;

        var participations = await aggregateToArray({ db, subject: [
            { $project: {
                '_id': true,
                '_P': '$scientific.state.internals.participatedInStudies',
            }},
            { $unwind: '$_P' },
            { $match: {
                '_P.csvImportId': csvImportId
            }}
        ]});
        console.dir(ejson(participations), { depth: null });
        
        expect(ejson(omit({
            fromItems: experiments,
            paths: [ '_id', '_rohrpostMetadata', 'csvImportId', 'state.seriesId' ],
        }))).toMatchSnapshot();

        expect(ejson(omit({
            fromItems: participations,
            paths: [ '_P._id', '_P.csvImportId', '_P.experimentId' ]
        }))).toMatchSnapshot();

        //var imports = await db.collection('csvImport').find().toArray();
        //console.dir(ejson(imports), { depth: null });

        //var { body } = koaContext.response;
        //var [ ageFrameUpdate ] = body.data;

        //console.log(ageFrameUpdate);

        //var record = omitNonsense({
        //    from: await this.getRecord('ageFrame', {
        //        _id: ageFrameUpdate.channelId
        //    })
        //});

        //console.dir(ejson(record), { depth: null });
        //expect(ejson(record)).toMatchSnapshot();
    })
});
