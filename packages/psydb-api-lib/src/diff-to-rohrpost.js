'use strict';

// converts deep diff output into rohspost messages
// that our event system understands
var diffToRohrpost = (diff) => {
    var messages = diff.map(translate);
    return messages;
}

var translate = (delta) => {
    var {
        kind,
        path,
        index,
        item,
        lhs, // unused
        rhs,
        inArray,
    } = delta;

    switch (kind) {
        case 'N':
            // NOTE: deep diff knows the index
            // of a pushed element in an array
            // so separate push op message is
            // not used
            return put({ path, rhs });
        
        case 'E':
            return put({ path, rhs });

        case 'D':
            return remove({ path });

        case 'A':
            return translate({
                kind: item.kind,
                path: [ ...path, index ],
                lhs: item.lhs,
                rhs: item.rhs,
                inArray: true,
            });

        default:
            throw new Error(`unknown delta type "${kind}"`);
    }
}

var escapeMatcher = /[~/]/g;
var escapeReplacer = (matched) => {
    switch (matched) {
        case '~':
            return '~0';
        case '/':
            return '~1';
        default:
            throw new Error('invalid match');
    }
}

var escapeTokens = (tokens) => {
    return tokens.map(it => (
        String(it).replace(escapeMatcher, escapeReplacer)
    ))
}

var tokensToJsonPointer = (tokens) => {
    return '/' + escapeTokens(tokens).join('/');
}

var put = ({ path, rhs }) => ({
    type: 'put',
    payload: {
        prop: tokensToJsonPointer(path),
        value: rhs,
    }
});

var remove = ({ path }) => ({
    type: 'remove',
    payload: {
        prop: tokensToJsonPointer(path),
    }
});

module.exports = diffToRohrpost;
