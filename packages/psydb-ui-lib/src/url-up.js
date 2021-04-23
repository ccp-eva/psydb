const urlUp = (url, levels = 0) => {
    for (var i = 0; i < levels; i += 1) {
        url = url.replace(/[\/]?[^/]+$/, '');
    }
    return url;
}

export default urlUp
