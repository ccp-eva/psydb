'use strict';

var getIntervalRemovalUpdateOps = (options) => {
    var { removeInterval, recordInterval: interval } = options;

    var isStartBelowRemoveStart = (
        removeInterval.start.getTime() > interval.start.getTime()
    );
    var isStartAboveRemoveStart = (
        removeInterval.start.getTime() < interval.start.getTime()
    );

    var isEndBelowRemoveEnd = (
        removeInterval.end.getTime() > interval.end.getTime()
    );
    var isEndAboveRemoveEnd = (
        removeInterval.end.getTime() < interval.end.getTime()
    );

    var isEqualStart = (
        removeInterval.start.getTime() === interval.start.getTime()
    );
    var isEqualEnd = (
        removeInterval.end.getTime() === interval.end.getTime()
    );

    // remove
    var isEqualAll = (
        isEqualStart && isEqualEnd
    );
    // remove
    var isInside = (
        isStartAboveRemoveStart && isEndBelowRemoveEnd
    );
    // remove
    var isInsideRightAligned = (
        isStartAboveRemoveStart && isEqualEnd
    );
    // remove
    var isInsideLeftAligned = (
        isEqualStart && isEndBelowRemoveEnd
    );

    // cut out the rem part
    var isOutside = (
        isStartBelowRemoveStart && isEndAboveRemoveEnd
    );
    // change end to rem start
    var isOutsideRightAligned = (
        isStartBelowRemoveStart && isEqualEnd
    );
    // change start to rem end
    var isOutsideLeftAligned = (
        isEqualStart && isEndAboveRemoveEnd
    );
    // change end to rem start
    var isOverlappingLeft = (
        isStartBelowRemoveStart && isEndBelowRemoveEnd
    );
    // change start to rem end
    var isOverlappingRight = (
        isStartAboveRemoveStart && isEndAboveRemoveEnd
    );

    var shouldRemove = (
        isEqualAll ||
        isInside ||
        isInsideRightAligned ||
        isInsideLeftAligned
    );

    var shouldUpdateStart = (
        isOutsideLeftAligned || isOverlappingRight
    );
    var shouldUpdateEnd = (
        isOutsideRightAligned || isOverlappingLeft
    );
    
    return {
        shouldRemove,
        shouldUpdateStart,
        shouldUpdateEnd,
        shouldCutOut: isOutside
    };
}

module.exports = getIntervalRemovalUpdateOps;
