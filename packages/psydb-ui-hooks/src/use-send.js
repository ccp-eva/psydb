import React, { useCallback } from 'react';
import agent from '@mpieva/psydb-ui-request-agents';

// FIXME: since introducing dependencies i dont rally like the
// signature of that function anmoyre
// useSend({ createMessage, onXXX, dependencies }) is probably more readable
const useSend = (
    createMessage,
    options = {}
) => {
    var {
        onSuccessfulUpdate,
        onFailedUpdate,
        dependencies = [],
    } = options;
   
    dependencies = [
        createMessage, onSuccessfulUpdate, onFailedUpdate,
        ...dependencies
    ]

    // FIXME: createMessage will change on every render
    // probably; so curretly the dependency checks do nothing
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
    }, dependencies)

    return send;
}

export default useSend;
