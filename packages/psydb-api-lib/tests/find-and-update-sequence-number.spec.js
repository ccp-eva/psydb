'use strict';
var { expect } = require('@mpieva/psydb-api-mocha-test-tools/chai');
var { ejson } = require('@mpieva/psydb-core-utils');

var { findAndUpdateSequenceNumber } = require('../src');

describe('findAndUpdateSequenceNumber()', function () {
    var db;
    beforeEach(async function () {
        await this.restore('init-minimal-with-api-key');
        db = this.getDbHandle();

        await db.collection('sequenceNumberPrefix').insertMany([
            {
                _id: { collection: 'subject', recordType: 'child' },
                prefix: 'de'
            }
        ])

        //this.fetchSeqs = () => (
        //    this.fetchAllRecords('sequenceNumbers_NEW')
        //)
    })

    it('on empty; no prefix; no desired; untyped', async function () {
        var next = await findAndUpdateSequenceNumber({
            db, collection: 'bar'
        });

        expect(next).to.eql('1');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 1,
            bar: 1
        })
    });

    it('on existing; no prefix; no desired; untyped', async function () {
        var next = await findAndUpdateSequenceNumber({
            db, collection: 'personnel'
        });

        expect(next).to.eql('2');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 2,
        })
    });

    it('on empty; no prefix; no desired; typed', async function () {
        var next = await findAndUpdateSequenceNumber({
            db, collection: 'subject', recordType: 'foo'
        });

        expect(next).to.eql('1');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 1,
            subject: { foo: 1 }
        })
    });

    it('on empty; prefixed; no desired, typed', async function () {
        var next = await findAndUpdateSequenceNumber({
            db, collection: 'subject', recordType: 'child'
        });

        expect(next).to.eql('de1');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 1,
            subject: { child: 1 }
        })
    })
    
    it('on empty; prefixed; with desired; typed', async function () {
        var next = await findAndUpdateSequenceNumber({
            db, collection: 'subject', recordType: 'child',
            desiredSequenceNumber: 'de200'
        });

        expect(next).to.eql('de200');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 1,
            subject: { child: 200 }
        })
    })
    
    it('on existing; prefixed, no desired; typed', async function () {
        await findAndUpdateSequenceNumber({
            db, collection: 'subject', recordType: 'child'
        });

        var next = await findAndUpdateSequenceNumber({
            db, collection: 'subject', recordType: 'child'
        });

        expect(next).to.eql('de2');
        var seqdoc = await db.collection('sequenceNumbers').findOne();
        expect(seqdoc).to.eql({
            _id: 1,
            personnel: 1,
            subject: { child: 2 }
        })
    })
})
