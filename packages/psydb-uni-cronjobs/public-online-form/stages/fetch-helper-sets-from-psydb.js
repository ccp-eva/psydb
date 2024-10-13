'use strict';
var { keyBy, groupBy } = require('@mpieva/psydb-core-utils');
var { sane, lc } = require('../utils');

var fetchHelperSetsFromPsydb = async (context, next) => {
    var { driver } = context;

    var setIds = await fetchSetIds({
        driver,
        constraints: { '/sequenceNumber': { $in: [
            "1", // language set
            "2", // acquisiton set
        ]}}
    });

    var [ languageSetId, acquisitionSetId ] = setIds;

    // FIXME: /setId constrainst currently cannot be an array :/
    var itemRecords = [
        ...( await fetchItemRecords({
            driver, constraints: { '/setId': languageSetId }
        })),
        ...( await fetchItemRecords({
            driver, constraints: { '/setId': acquisitionSetId }
        })),
    ]

    var itemsBySetId = groupBy({
        items: itemRecords,
        byProp: 'setId',
        transform: (it) => ({
            _id: it._id,
            nameDE: lc(sane(it.state.displayNameI18N.de || ''))
        })
    });

    var languagesByNameDE = keyBy({
        items: itemsBySetId[languageSetId],
        byProp: 'nameDE',
        transform: (it) => it._id
    });
    
    var acquisitionsByNameDE = keyBy({
        items: itemsBySetId[acquisitionSetId],
        byProp: 'nameDE',
        transform: (it) => it._id
    });

    context.languages = languagesByNameDE;
    context.acquisitions = acquisitionsByNameDE;

    await next();
}

var fetchSetIds = async (bag) => {
    var { driver, constraints } = bag;

    var fetched = await driver.post({
        url: '/helperSet/list',
        payload: {
            constraints,

            limit: 1000,
            offset: 0,
            filters: {},
            showHidden: true,
        }
    });

    var { records } = fetched.data;

    var out = records.sort((a,b) => (
        a.sequenceNumber.localeCompare(
            b.sequenceNumber, undefined, { numeric: true }
        )
    )).map(it => it._id);

    return out;
}

var fetchItemRecords = async (bag) => {
    var { driver, constraints } = bag;
    
    var fetched = await driver.post({
        url: '/helperSetItem/list',
        payload: {
            constraints,

            limit: 1000,
            offset: 0,
            target: 'table',
            filters: {},
            showHidden: true,
        }
    });

    var { records } = fetched.data;
    return records;
}

module.exports = { fetchHelperSetsFromPsydb }
