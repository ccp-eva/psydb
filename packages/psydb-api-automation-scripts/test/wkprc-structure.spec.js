'use strict';
var { expect } = require('chai');
var { ejson } = require('@cdxoo/mongo-test-helpers');
var script = require('../src/scripts/wkprc-structure');

describe('wkprc-structure', function () {
    var db;
    beforeEach(async function () {
        await this.restore(
            'init-minimal-with-api-key'
        );
        
        db = this.getDbHandle();
    });

    it('does the thing', async function () {
        await this.execute({
            script, apiKey: [
                'xA3S5M1_2uEhgelRVaZyYjg5qw_UehHV',
                'B1bGmH9X7-S8x8sslsUxIFH5_n85Tkdh'
            ].join('')
        });
    })
})
