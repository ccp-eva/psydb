'use strict';
var fs = require('fs');
var mime = require('mime-types');
var { Base64 } = require('js-base64');

var encodeBrandingLogos = (config) => {
    var { branding: { landing, sidenav }} = config;

    for (var [ key, filepath ] of Object.entries(landing.logos)) {
        landing.logos[key] = encodeOne(filepath);
    }
    for (var [ key, filepath ] of Object.entries(sidenav.logos)) {
        sidenav.logos[key] = encodeOne(filepath);
    }
}

var encodeOne = (filepath) => {
    var type = mime.lookup(filepath);
    var b64 = Base64.encode(fs.readFileSync(filepath, { encoding: null }));
    
    return (
        `data:${type};base64,${b64}`
    )
}

module.exports = encodeBrandingLogos;
