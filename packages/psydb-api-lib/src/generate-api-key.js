'use strict';
var { customAlphabet, urlAlphabet } = require('nanoid');
var generateApiKey = customAlphabet(urlAlphabet, 64);
module.exports = { generateApiKey }
