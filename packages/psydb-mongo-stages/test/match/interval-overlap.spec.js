var { expect } = require('chai');
var { match } = require('../../src');

var ids = records => records.map(it => it._id);

describe('match/IntervalOverlapsOurs()', function () {
    var db, ints, partials, dates;
    beforeEach(async function () {
        db = this.getDbHandle();

        ({ ints, partials, dates } = await fixtures({ db }))
    });

    it('left overlap', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 50, end: 150 }
            })
        ]).toArray();

        expect(ids(found)).to.eql([ 1 ])
    });
    
    it('left overlap (point)', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 100, end: 100 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 1 ])
    });
    
    it('right overlap', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 250, end: 350 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 2 ])
    });
    
    it('our interval is fully contained', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 110, end: 180 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 1 ])
    })
    
    it('db interval is fully contained', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 50, end: 350 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 1, 2 ])
    })
    
    it('no-overlap', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 9000, end: 9001 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([])
    })

    it('multi overlap', async () => {
        var found = await ints.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 150, end: 250 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 1, 2 ])
    });

    it('matches partial db intervals (end set)', async () => {
        var found = await partials.aggregate([
            match.IntervalOverlapsOurs({
                dbpath: 'state',
                interval: { start: 0, end: 99 }
            })
        ]).toArray();
        expect(ids(found)).to.deep.eql([ 2 ])
    })
})

var fixtures = async (bag) => {
    var { db } = bag;
    var ints = db.collection('ints');
    var partials = db.collection('partials');
    var dates = db.collection('dates');

    await ints.insertOne({ _id: 1, state: {
        start: 100, end: 199
    }});
    await ints.insertOne({ _id: 2, state: {
        start: 200, end: 299
    }});

    await partials.insertOne({ _id: 1, state: {
        start: 100
    }});
    await partials.insertOne({ _id: 2, state: {
        end: 299
    }});

    await dates.insertOne({ _id: 1, state: {
        start: new Date('2000-01-01T00:00:00.000Z'),
        end: new Date('2000-12-31T23:59:59.999Z'),
    }});
    await dates.insertOne({ _id: 2, state: {
        start: new Date('2001-01-01T00:00:00.000Z'),
        end: new Date('2001-12-31T23:59:59.999Z'),
    }});

    return { ints, partials, dates }
}
