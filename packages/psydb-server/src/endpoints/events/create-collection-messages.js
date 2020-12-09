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
}) => {
    var propMessages = Object.keys(props).map(key => ({
        subChannelKey,
        type: op,
        // TODO: rohrpost dispatch needs to accept custom message metadata
        personnelId,
        payload: {
            prop: key,
            value: props[key]
        }
    }));

    return propMessages;
};

module.exports = createCollectionMessages;
