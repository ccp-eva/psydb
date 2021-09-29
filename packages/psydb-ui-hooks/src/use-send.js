import React, { useCallback } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

const useSend = (createMessage, { onSuccessfulUpdate, onFailedUpdate }) => {
    var send = useCallback((...args) => {
        var message = createMessage(...args);
        
        agent.send({ message })
        .then((response) => {
            onSuccessfulUpdate && onSuccessfulUpdate(response)
        })
        .catch((error) => {
            if (onFailedUpdate) {
                onFailedUpdate(error)
            }
            else {
                throw error;
            }
        })
    }, [ createMessage, onSuccessfulUpdate, onFailedUpdate ])

    return send;
}

export default useSend;
