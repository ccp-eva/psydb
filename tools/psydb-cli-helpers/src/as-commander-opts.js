var asCommanderOpts = (optary) => {
    var out = [];
    for (var it of optary) {
        var {
            long,
            short,
            arg,
            description,
            defaults,
            parse = (x) => (x)
        } = it;

        short = short ? `-${short}, ` : '';
        long = `--${long}`;
        arg = arg ? ` <${arg}>` : '';

        var def = `${short}${long}${arg}`;
        out.push([
            def,
            description,
            parse,
            defaults
        ]);
    }

    return out;
}

module.exports = asCommanderOpts;
