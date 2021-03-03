'use strict';
var createCollectionMessages = ({
    personnelId,
    props,
    op = 'put',
}) => {
    var messages;

    if (props.gdpr || props.scientific) {
        messages = [
            ...(
                props.gdpr
                ? createSubChannelMessages({
                    op,
                    personnelId,
                    subChannelKey: 'gdpr',
                    props: props.gdpr,
                })
                : []
            ),
            ...(
                props.scientific
                ? createSubChannelMessages({
                    op,
                    personnelId,
                    subChannelKey: 'scientific',
                    props: props.scientific,
                })
                : []
            )
        ];

    }
    else {
        messages = createSubChannelMessages({
            op,
            personnelId,
            props,
        });
    }

    //console.log(messages);
    return messages;
};

var createSubChannelMessages = ({
    op,
    subChannelKey,
    personnelId,
    props,
    prefix,
}) => {
    var propMessages = Object.keys(props).reduce((acc, key) => ([
        // NOTE: since custom fields might have individual permissions
        // in the future we need to split those
        // TODO: figure out if this is true for other fields such as
        // systempermissions n such
        ...acc,
        ...(
            key === 'custom'
            ? (
                createSubChannelMessages({
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

module.exports = createCollectionMessages;
