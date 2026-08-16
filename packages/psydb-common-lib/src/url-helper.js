'use strict';
// NOTE could use URL/URLSearchParams but need support for node and browser
// browser: require('url-search-params-polyfill'); // and just use the stuff
// node: var { URL, URLSearchParams } = require('url');
// ....well

var appendQuery = require('append-query');
var { entries } = require('@mpieva/psydb-core-utils');

var sanitize = (url = '') => (
    url.endsWith('/') ? url.replace(/\/+$/, '') : url
);

var up = (url, levels = 0) => {
    url = url.replace(/[\/]$/, '');
    for (var i = 0; i < levels; i += 1) {
        url = url.replace(/[\/]?[^/]+$/, '');
    }
    if (url === '') {
        url = '/'
    }
    return url;
}

var hashify = (url) => (
    `#${sanitize(url)}`
);

// "/foo/:id/:other", { id: 1: other: bar } => /foo/1/bar
var fill = (urlpattern, values = {}) => {
    // FIXME: stuff like "/:foo:foobar" has issues
    for (var [ key, value ] of entries(values)) {
        urlpattern = urlpattern.replace(`:${key}`, value)
    }
    return urlpattern
}

var query = (url, obj) => {
    return appendQuery(url, obj)
}

module.exports = {
    sanitize, up, hashify, fill, query
}
