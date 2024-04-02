'use strict';
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var { getContent: loadCSV } = require('@mpieva/psydb-fixtures/csv');

var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../src/');

var omitNonsense = ({ from }) => omit({
    from, paths: [ '_id', '_rohrpostMetadata' ]
});

describe('csv-import/create-subject-import fs-malaysia', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        await this.restore('2023-11-29__0517-wkprc-fieldsite');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        var file = await createFakeFileUpload({
            db, buffer: loadCSV('evapecognition/simple'),
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
            type: 'csv-import/experiment/create-wkprc-evapecognition',
            timezone: 'UTC',
            payload: jsonify({
                subjectType,
                studyId,
                locationId,
                fileId,
                labOperatorIds
            })
        });

        var { body } = koaContext.response;
        var [ ageFrameUpdate ] = body.data;

        console.log(ageFrameUpdate);

        var record = omitNonsense({
            from: await this.getRecord('ageFrame', {
                _id: ageFrameUpdate.channelId
            })
        });

        console.dir(ejson(record), { depth: null });
        expect(ejson(record)).toMatchSnapshot();
    })
})
