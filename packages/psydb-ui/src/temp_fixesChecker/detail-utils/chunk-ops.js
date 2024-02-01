import { makeChunks } from './make-chunks';

export const chunkOps = ({ ops }) => {
    var outChunks = [];
    for (var c of makeChunks({ from: ops, chunkSize: 4 })) {
        var pairs = makeChunks({ from: c, chunkSize: 2 });

        var outPairs = [];
        var targetCollection = undefined;
        for (var p of pairs) {
            var outItem = {};
            for (var it of p) {
                var { collection, args } = it;
                var { _id } = args[0];

                outItem[collection] = { targetId: _id, ...it };
                if (collection !== 'rohrpostEvents') {
                    targetCollection = collection;
                }
            }
            if (!targetCollection) {
                targetCollection = 'rohrpostEvents'
            }
            outPairs.push({ targetCollection, pair: outItem });
        }
        outChunks.push(outPairs);
    }
    return outChunks;
}
