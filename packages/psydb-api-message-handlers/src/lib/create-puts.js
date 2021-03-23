'use strict';

var createPuts = (mapping, additionalProps) => {
    var messages = [];
    for (var prop of Object.keys(mapping)) {
        messages.push({
            type: 'put',
            ...additionalProps,
            payload: {
                prop,
                value: mapping[prop]
            }
        })
    }
    return messages;
}

module.exports = createPuts;
