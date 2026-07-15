'use strict';
var createMatchStages = require('./create-match-stages');

var createFullQuicksearchStages = (bag) => {
    var { definitions, quicksearch = {} } = bag;
    
    var augmented = [];
    for (var it of definitions) {
        var { pointer } = it;
        augmented.push({ definition: it, input: quicksearch[pointer] });
    }

    return createMatchStages({ from: augmented, type: 'quick-search' });
}

module.exports = createFullQuicksearchStages;
