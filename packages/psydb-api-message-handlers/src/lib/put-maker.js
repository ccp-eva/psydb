'use strict';
var PutMaker = (sharedProps) => ({
    all: (mapping) => {
        var messages = [];
        for (var prop of Object.keys(mapping)) {
            messages.push({
                type: 'put',
                ...sharedProps,
                payload: {
                    prop,
                    value: mapping[prop]
                }
            })
        }
        return messages;
    }
});

module.exports = PutMaker;
