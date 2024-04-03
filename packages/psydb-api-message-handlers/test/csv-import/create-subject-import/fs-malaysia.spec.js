'use strict';
var { ejson, omit } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ObjectId } = require('@cdxoo/mongo-test-helpers');
var jsonify = (that) => (
    JSON.parse(JSON.stringify(that))
);

var RootHandler = require('../../../src/');

var omitNonsense = ({ from }) => omit({
    from, paths: [ '_id', '_rohrpostMetadata' ]
});

describe('csv-import/create-subject-import fs-malaysia', function () {
    var db, sendMessage, fileId;
    beforeEach(async function () {
        await this.restore('2024-03-29__1914_fieldsites');
        
        db = this.getDbHandle();
        ([ sendMessage ] = this.createMessenger({
            RootHandler,
            ...(await this.createFakeLogin({ email: 'root@example.com' }))
        }));

        var file = await createFakeFileUpload({
            db, buffer: fs.readFileSync(__dirname + '/fs-malaysia.csv')
        });
        fileId = file._id;
    });

    it('does the thing', async function () {
        var subjectType = 'fs_malaysia_subject';
        var researchGroupId = ObjectId("66051bb1c1e37e5a99ee54c3");

        var koaContext = await sendMessage({
            type: 'csv-import/subject/create',
            timezone: 'UTC',
            payload: jsonify({
                subjectType,
                fileId,
                accessRightsByResearchGroup: [
                    { researchGroupId, permission: 'write' }
                ]
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
