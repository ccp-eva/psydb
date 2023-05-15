'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var setId = cache.get('/helperSet/novel');

    var labels = [
        'Nonen',
        'Balber',
    ];

    for (var [ix, it] of labels.entries()) {
        await driver.sendMessage({
            type: 'helperSetItem/create',
            payload: { setId, props: {
                label: it
            }},
        }, { apiKey });

        cache.addId({
            collection: 'helperSetItem',
            recordType: 'novel',
            as: it
        });
    }
}



