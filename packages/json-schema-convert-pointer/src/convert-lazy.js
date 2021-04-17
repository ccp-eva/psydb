'use strict';
var inline = require('@cdxoo/inline-string');

// FIXME: items not needed here anymore
var ex = RegExp(inline`
    (?:
        \\/?properties\\/([^/]+)(?:\\/items)?
        | 
        \\/?oneOf\\/\\d+
        |
        \\/?allOf\\/\\d+
    )
`, 'g');

var convertLazy = (pointer) => {
    return pointer.replace(
        ex, 
        (match, captureGroup01, offset, original) => (
            captureGroup01
            ? `/${captureGroup01}`
            : ''
        )
    );
}

module.exports = convertLazy;
