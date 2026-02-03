'use strict';

var maybeInjectApiKey = ({ url, apiKey }) => {
    var out = (
        apiKey
        ? `${url}?apiKey=${apiKey}`
        : url
    );
    return out;
}

module.exports = maybeInjectApiKey;
