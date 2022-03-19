'use strict';
// TODO move to core utils

var hasDotRegex = /\./;
var hasEscapeRegex = /~/;
var escapeMatcher = /~[01]/g;
function escapeReplacer (m) {
  switch (m) {
    case '~1': return '/';
    case '~0': return '~';
  }
  throw new Error('Invalid tilde escape: ' + m);
}
var convertPointerToPath = (pointer) => {
    if (hasDotRegex.test(pointer)) {
        throw new Error(
            //FIXME: are dots escapeable somehow?
            `Unconvertible Pointer: "${pointer}"`
        );
    }
    var tokens = pointer.split('/'),
        converted = [];
    for (var token of tokens) {
        if (token) {
            if (!hasEscapeRegex.test(token)) {
                converted.push(token)
            }
            else {
                converted.push(token.replace(escapeMatcher, escapeReplacer));
            }
        }
    }

    return converted.join('.');
}

module.exports = convertPointerToPath;
