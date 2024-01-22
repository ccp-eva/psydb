'use strict';
var requireify = (props) => ({
    properties: props,
    required: Object.keys(props),
});

module.exports = requireify;
