'use strict';
var AsyncFunction = (async () => {}).constructor;

module.exports = (f) => (
    f instanceof AsyncFunction
);
