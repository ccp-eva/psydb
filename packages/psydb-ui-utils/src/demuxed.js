const demuxed = (callbacks) => (...args) => {
    var out = [];
    for (var it of onSuccessfulUpdate) {
        it && out.push(it(...args));
    }
    return out;
}

export default demuxed;
