import jsonpointer from 'jsonpointer';

const convertPathToPointer = (path) => {
    var tokens = path.split('.');
    var matcher = /[\/\.]/g;
    var escaper = (m) => {
        switch (m) {
            case '~': return '~0';
            case '/': return '~1';
        }
    }
    tokens = tokens.map(it => (
        it
        ? it.replace(matcher, escaper)
        : it // FIXME: throw error here?
    ));

    return '/' + tokens.join('/');
}

const onlyDeep = ({ from, paths }) => {
    var out = {};
    for (var path of paths) {
        var pointer = convertPathToPointer(path);
        var value = jsonpointer.get(from, pointer);
        jsonpointer.set(out, pointer, value);
    }
    return out;
}

export default onlyDeep;
