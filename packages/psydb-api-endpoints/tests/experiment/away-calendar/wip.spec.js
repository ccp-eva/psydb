'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var endpoints = require('../../../src');

var endpoint = endpoints.experiment.awayCalendar;

describe('experiment/awayCalendar wip', function () {
    var db, session;
    beforeEach(async function () {
        //db = await this.restore('2024-03-29__1914_fieldsites');
        db = await this.connectLocal();
        session = await this.createFakeSession('root@example.com');
    });

    it('stub', async function () {
        var koaContext = this.createKoaContext({
            ...session,
            request: {
                headers: { language: 'en', locale: 'en', timezone: 'UTC' },
                body: {
                    locationType: 'kiga',
                    experimentType: 'away-team',
                    interval: {
                        start: '2001-01-01T00:00:00.000Z',
                        end: '2027-01-01T00:00:00.000Z',
                    },
                    researchGroupId: '64d42dc8443aa279ca4cae99',
                    //showPast: true,
                }
            }
        });

        await endpoint(koaContext, async () => {});
        console.ejson(koaContext.body);
        var { data } = koaContext.body;
        console.log(Object.keys(data));
        console.log(data.experimentOperatorTeamRecords);
        expect(data.studyRecords).toMatchSnapshot();
        expect(data.studyRecordLabels).toMatchSnapshot();
        expect(data.experimentRecords).toMatchSnapshot();
        expect(data.experimentOperatorTeamRecords).toMatchSnapshot();
        expect(data.experimentRelated).toMatchSnapshot();

        expect(data.locationRecordsById).toMatchSnapshot();
        expect(data.locationRelated).toMatchSnapshot();
        expect(data.locationDisplayFieldData).toMatchSnapshot();
        //expect(koaContext.body).toMatchSnapshot();
    });

});
