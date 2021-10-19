'use strict';
var createEventMessagesFromProps = require('../create-event-messages-from-props');

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
                ? createEventMessagesFromProps({
                    op,
                    personnelId,
                    subChannelKey: 'gdpr',
                    props: props.gdpr,
                })
                : []
            ),
            ...(
                props.scientific
                ? createEventMessagesFromProps({
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
        messages = createEventMessagesFromProps({
            op,
            personnelId,
            props,
        });
    }

    //console.log(messages);
    return messages;
};


module.exports = createCollectionMessages;
