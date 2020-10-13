'use strict';
var Channel = require('./channel');

var Rohrpost = ({
    key,
    createChannelId,
    createMessageId,
    onDispatch,
}) => {
    var rohrpost = {};

    rohrpost.openChannel = ({ id: maybeId }) => (
        Channel({
            id: maybeId || createChannelId(),
            isNew: !maybeId,
            rohrpostKey: key,

            createMessageId,
            createMessageEnvelope,
        })
    );

    return rohrpost;
};

module.exports = Rohrpost;
