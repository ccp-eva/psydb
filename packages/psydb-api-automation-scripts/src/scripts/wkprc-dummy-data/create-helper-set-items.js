'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache, setLabel, items } = bag;
    var setId = cache.get(`/helperSet/${setLabel}`);

    for (var [ix, it] of items.entries()) {
        await driver.sendMessage({
            type: 'helperSetItem/create',
            payload: { setId, props: {
                label: it,
                displayNameI18N: {},
            }},
        }, { apiKey });

        cache.addId({
            collection: 'helperSetItem',
            recordType: setLabel,
            as: it
        });
    }
}



