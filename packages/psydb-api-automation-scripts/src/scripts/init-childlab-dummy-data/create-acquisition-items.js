'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;
    var setId = cache.get('/helperSet/acquisition');

    var labels = [
        'Ordnungsamt',
        'Kindergarten'
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
            recordType: 'acquisition',
            as: it
        });
    }
}



