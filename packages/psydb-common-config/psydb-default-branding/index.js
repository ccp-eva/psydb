'use strict';
var path = require('path');
var logoDE = path.join(__dirname, 'mp-logo-farbig-rgb.svg');
var logoEN = path.join(__dirname, 'mp-logo-en-farbig-rgb.svg');

module.exports = {
    cssvars: {
        '--default-text': '#212529',

        '--primary': '#006c66',
        '--primary-btn-hover': '#007d77',
        '--primary-btn-disabled': '#006c66',
        '--primary-a-disabled': '#227e77',
        '--primary-a-hover': '#228e88',

        '--info-alert-text': '#0c5460',
        '--info-alert-bg': '#d1ecf1',
        '--info-alert-border': '#bee5eb',

        '--form-control-focus': '#779799',
        '--loader-base-color': '#006c6644',
        '--loader-highlight-color': '#006c66',
    },
    landing: {
        logos: {
            'en': logoEN,
            'de': logoDE,
        },
        style: {
            marginTop: '-30px',
            marginRight: '-20px',
            marginBottom: '-25px',
            marginLeft: '-20px',
        }
    },
    sidenav: {
        logos: {
            'en': logoEN,
            'de': logoDE,
        },
        style: {
            marginLeft: '-20px',
            marginRight: '-20px',
            marginTop: '-20px',
        }
    }
}
