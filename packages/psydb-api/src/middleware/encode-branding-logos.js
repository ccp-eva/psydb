'use strict';
var fs = require('fs');
var mime = require('mime-types');
var { Base64 } = require('js-base64');

var encodeBrandingLogos = (config) => {
    var { branding } = config;

    if (!branding) {
        console.warn('no branding found');
        return;
    }

    var { landing, sidenav } = branding;
    if (!landing) {
        for (var [ key, filepath ] of Object.entries(landing.logos)) {
            landing.logos[key] = encodeOne(filepath);
        }
    }
    else {
        console.warn('branding misses "landing" logo property');
    }
    
    if (!sidenav) {
        for (var [ key, filepath ] of Object.entries(sidenav.logos)) {
            sidenav.logos[key] = encodeOne(filepath);
        }
    }
    else {
        console.warn('branding misses "sidenav" logo property');
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
