'use strict';
var { decode } = require('libqp');
var { convert } = require('html-to-text');

var parseMailHtml = async (context, next) => {
    var { mail } = context;
    var it = mail; // FIXME

    var { htmlPart } = it;
    var html = String(decode(htmlPart));

    var out = convert(html, {
        wordwrap: 999999,
        selectors: [
            { selector: '*', format: 'formatter' },
        ],
        formatters: {
            formatter,
        }
    })

    var lines = out.split(/\n/g);
    var pairs = [];
    for (var ix = 0; ix < lines.length; ix += 2) {
        var key = lines[ix];
        var value = lines[ix + 1];
        pairs.push({ key, value });
    }

    it.pairs = pairs;

    await next();
}

var formatter = (elem, walk, builder) => {
    var items = elem.children.filter(it => (
        it.type === 'text' && it.data.trim() !== ''
        || it.type !== 'text'
    )).map(it => (
        it.type === 'text'
        ? { ...it, data: it.data.trim().replace(/[\r\n\t]+/g, '') }
        : it
    ));

    builder.openBlock({ leadingLineBreaks: 1 });
    walk(items, builder)
    builder.closeBlock({ leadingLineBreaks: 1 });
}

module.exports = { parseMailHtml }
