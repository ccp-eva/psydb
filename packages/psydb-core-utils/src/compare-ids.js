'use strict';
// common lib is shared in frond and backend; therefor we dont have
// the option to use ObjectId; the only options other that that we can only
// fall back to stringly compare them; which affects the backend as well
// unfortunately
var compareIds = (a, b) => (
    String(a) === String(b)
);

module.exports = compareIds;
