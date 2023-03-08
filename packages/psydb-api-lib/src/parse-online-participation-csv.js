'use strict';
var ApiError = require('./api-error');

var isDateTimeZ = (str) => (
    (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)$/i).test(str)
)

var parseOnlineParticipationCSV = (bag) => {
    var { data } = bag;

    var [ head, ...lines ] = data.split(/[\r\n]+/);
    var headcols = head.split(/[;,]/);
    if (headcols.length !== 2) {
        throw new ApiError(
            409, 'columns should be "onlineId" and "timestamp"'
        );
    }
    var indices = {
        onlineId: headcols.findIndex(it => it === 'onlineId'),
        timestamp: headcols.findIndex(it => it === 'timestamp'),
        //status: headcols.findIndex(it => it === 'status'),
    }

    if (areIndicesMissing(indices)) {
        throw new ApiError(
            409, 'columns should be "onlineId" and "timestamp"'
        );
    }

    var out = [];
    for (var it of lines) {
        var datacols = it.split(/[;,]/);
        if (datacols.length !== 2) {
            throw new ApiError(
                409, 'columns should be "onlineId" and "timestamp"'
            );
        }
        var onlineId = datacols[indices.onlineId];
        var timestamp = datacols[indices.timestamp];
        //var status = datacols[indices.status];
        
        if (!isDateTimeZ(timestamp)) {
            throw new ApiError(
                409, 'data of column "timestamp" should be ISODate'
            );
        }

        out.push({
            onlineId,
            timestamp: new Date(timestamp)
        })
    }

    return out;
}

var areIndicesMissing = (indices) => {
    for (var it of Object.values(indices)) {
        if (it === undefined || it === -1) {
            return true;
        }
    }
    return false;
}

module.exports = { parseOnlineParticipationCSV }
