'use strict';
var { ObjectId } = require('mongodb');
var { range, forcePush } = require('@mpieva/psydb-core-utils');
var { FakeRecords, Fields } = require('@mpieva/psydb-faker');

var FOUNDER_COUNT = 3;
var OFFSPRING_COUNT = 2;

module.exports = async (context) => {
    var { driver, refcache, ids, crts } = context;
    var crtSettings = crts['subject']['cat'];

    // founders have no known parents and are born 2012 - 2017;
    // NOTE: with this few founders the sex is fixed so that there
    // is always at least one mother and one father
    var founders = [];
    for (var ix of range(FOUNDER_COUNT)) {
        var faked = fakeCat({ refcache, crtSettings, overrides: {
            '/scientific/state/custom/dateOfBirth': (
                deterministicDate({ ix, fromYear: 2012, years: 6 })
            ),
            '/scientific/state/custom/sex': (
                ix % 2 === 0 ? 'female' : 'male'
            ),
        }});
        var cat = await driver.subject.create({ type: 'cat', data: faked });
        founders.push({ ...cat, sex: getSex(faked) });
    }

    var mothers = founders.filter(it => it.sex === 'female');
    var fathers = founders.filter(it => it.sex === 'male');

    // offspring are born 2018 - 2025; mother is always known,
    // father only sometimes
    var offspring = [];
    for (var ix of range(OFFSPRING_COUNT)) {
        var motherId = Fields.ForeignId({ isNullable: false }, {
            fromList: mothers.map(it => it.meta._id)
        });
        var fatherId = Fields.ForeignId({ isNullable: true }, {
            fromList: fathers.map(it => it.meta._id)
        });

        var faked = fakeCat({ refcache, crtSettings, overrides: {
            '/scientific/state/custom/dateOfBirth': (
                deterministicDate({ ix, fromYear: 2018, years: 8 })
            ),
            '/scientific/state/custom/motherId': motherId,
            '/scientific/state/custom/fatherId': fatherId,
        }});
        var cat = await driver.subject.create({ type: 'cat', data: faked });
        offspring.push(cat);
    }

    var cats = [ ...founders, ...offspring ];
    await ids.addByDriverResponse('subject', cats);
    forcePush({
        into: refcache.data(),
        pointer: '/subject/cat',
        values: cats.map(it => new ObjectId(it.meta._id))
    });
}

var fakeCat = (bag) => {
    var { refcache, crtSettings, overrides } = bag;
    return FakeRecords['subject']({
        refcache: refcache.data(), crtSettings, overrides: {
            '/scientific/state/custom/motherId': null,
            '/scientific/state/custom/fatherId': null,
            // NOTE: there are no cat subject groups yet
            '/scientific/state/custom/groupId': null,
            ...overrides,
        }
    });
}

var getSex = (faked) => faked.scientific.state.custom.sex;

// NOTE: faker dates are not bounded; we need parents to be older
// than their offspring
var deterministicDate = (bag) => {
    var { ix, fromYear, years } = bag;
    var year = fromYear + (ix % years);
    var month = (ix * 7) % 12;
    var day = 1 + ((ix * 11) % 28);
    return new Date(Date.UTC(year, month, day));
}
