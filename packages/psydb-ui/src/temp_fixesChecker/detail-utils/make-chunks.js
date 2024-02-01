export const makeChunks = ({ from, chunkSize }) => {
    var out = [];
    for (var i = 0; i < from.length; i += chunkSize) {
        var chunk = from.slice(i, i + chunkSize);
        out.push(chunk);
    }
    return out;
}
