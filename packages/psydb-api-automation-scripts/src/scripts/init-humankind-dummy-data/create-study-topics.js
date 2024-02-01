'use strict';
module.exports = async (bag) => {
    var { apiKey, driver, cache } = bag;

    var baseData = [
        { name: 'Test-Topic' }
    ];

    for (var [ix, it] of baseData.entries()) {
        var { name } = it;
        await driver.sendMessage({
            type: 'studyTopic/create',
            payload: { props: {
                name, parentId: null
            }},
        }, { apiKey });

        cache.addId({
            collection: 'studyTopic',
            as: name
        });
    }
}



