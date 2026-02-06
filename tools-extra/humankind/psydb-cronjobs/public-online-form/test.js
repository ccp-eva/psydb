var { convert } = require('html-to-text');

var tdFormatter = function (elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 1 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 1 });
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

var f = require('fs').readFileSync('./Text.html');
var out = convert(String(f), {
    wordwrap: 999999,
    selectors: [
        { selector: '*', format: 'formatter' },
    ],
    formatters: {
        formatter,
    }
})

var lines = out.split(/\n/g)
for (var ix = 0; ix < lines.length; ix += 2) {
    var key = lines[ix];
    var value = lines[ix + 1];
    console.log({ key, value });
}

