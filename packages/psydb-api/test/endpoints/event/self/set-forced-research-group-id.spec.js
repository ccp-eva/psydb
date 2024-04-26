'use strict';
//require('debug').enable('psydb*');
var { expect } = require('chai');

describe('self/set-forced-research-group', function () {
    var db, agent;
    beforeEach(async function () {
        await this.restore('init-childlab-with-dummy-data');
        this.createKoaApi();
        await this.signIn();

        agent = this.getApiAgent();
        db = this.getDbHandle();
    });

    it('does stuff', async function () {
        var childlab = await this.getId('researchGroup', {
            'shorthand': /childlab/i
        });

        var response = await (
            agent.post('/', {
                type: 'self/set-forced-research-group',
                timezone: 'Europe/Berlin',
                payload: {
                    researchGroupId: childlab,
                }
            })
        );

        console.dir(response.data, { depth: null });
    });
})
