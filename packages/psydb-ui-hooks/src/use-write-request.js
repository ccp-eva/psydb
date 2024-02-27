import { useState, useContext } from 'react';
import { arrify, demuxed } from '@mpieva/psydb-ui-utils';
import { AgentContext } from '@mpieva/psydb-ui-contexts';

const useWriteRequest = (
    createPromise,
    options = {}
) => {
    var {
        onSuccessfulUpdate,
        onFailedUpdate,
    } = options;
   
    var contextAgent = useContext(AgentContext);
    var [ isTransmitting, setIsTransmitting ] = useState(false);

    var exec = (...args) => {
        setIsTransmitting(true);

        return createPromise(contextAgent, ...args)
        .then((response) => {
            setIsTransmitting(false);
            if (onSuccessfulUpdate) {
                demuxed(arrify(onSuccessfulUpdate))(response, args);
            }
        })
        .catch((error) => {
            setIsTransmitting(false);
            if (onFailedUpdate) {
                demuxed(arrify(onFailedUpdate))(error, args);
            }
            else {
                throw error;
            }
        })
    }

    var passthrough = {
        onSubmit: exec,
        isTransmitting
    }

    return { isTransmitting, exec, passthrough };
}

export default useWriteRequest;
