'use strict';

var createEventMessagesFromProps = ({
    op,
    subChannelKey,
    personnelId,
    props,
    prefix,
}) => {
    var propMessages = Object.keys(props).reduce((acc, key) => ([
        ...acc,
        ...(
            key === 'custom'
            ? (
                createEventMessagesFromProps({
                    op, subChannelKey, personnelId,
                    props: props[key],
                    prefix: (
                        prefix
                        ? `${prefix}/${key}`
                        : `/state/${key}`
                    ),
                }) 
            )
            : [{
                subChannelKey,
                type: op,
                // TODO: rohrpost dispatch needs to accept custom
                // message metadata
                personnelId,
                payload: {
                    prop: (
                        prefix 
                        ? `${prefix}/${key}` 
                        : `/state/${key}`
                    ),
                    value: props[key]
                }
            }]
        )
    ]), []);

    return propMessages;
};

module.exports = createEventMessagesFromProps;
