'use strict';
var RemoveMaker = (sharedProps) => ({
    all: (mapping) => {
        var messages = [];
        for (var prop of Object.keys(mapping)) {
            var suffixes = mapping[prop];
            for (var suffix of suffixes) {
                messages.push({
                    type: 'remove',
                    ...sharedProps,
                    payload: {
                        prop: `${prop}/${suffix}`,
                    }
                })
            }
        }
        return messages;
    }
});

module.exports = RemoveMaker;
