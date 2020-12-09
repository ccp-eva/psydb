'use strict';
var parseCollectionMessageType = (type) => {
    var rx = /^collection\/([a-zA-Z0-9_]+)\/(create|patch|delete)$/;
    var match = type.match(rx);

    return { collection: match[1], op: match[2] };
}

module.exports = parseCollectionMessageType;
