'use strict';
var PushMaker = (sharedProps) => ({
    all: (mapping) => {
        var messages = [];
        for (var prop of Object.keys(mapping)) {
            var arrayOrValue = oneProp(sharedProps, prop, mapping[prop]);
            messages = [
                ...messages,
                ...(
                    Array.isArray(arrayOrValue)
                    ? arrayOrValue
                    : [ arrayOrValue ]
                )
            ];
        }
        return messages;
    },
    one: (prop, value) => oneProp(sharedProps, prop, value),
});

var oneProp = (sharedProps, prop, arrayOrValue) => {
    if (Array.isArray(arrayOrValue)) {
        return arrayOrValue.map(value => oneProp(sharedProps, prop, value));
    }
    else {
        return ({
            type: 'push',
            ...sharedProps,
            payload: {
                prop,
                value: arrayOrValue
            }
        })
    }
}

module.exports = PushMaker;
