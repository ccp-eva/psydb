'use strict';

var keySequence = (bag) => {
    var {
        sequence,
        keys,
        transform = (it) => (it)
    } = bag;

    var out = {};
    for (var [ix, it] of sequence.entries()) {
        out[keys[ix]] = transform(it);
    }
    return out;
}

module.exports = keySequence;
