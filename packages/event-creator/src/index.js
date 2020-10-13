'use strict';

var root = ({
    correlationId,
    timestamp,
    payload,
}) => {
    var data = {
        correlationId,
        timestamp,
        payload,
    };

    var event = { data };



    return event;
}

var nested = ({

})
