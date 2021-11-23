import { useState } from 'react';
import { arrify, demuxed } from '@mpieva/psydb-ui-utils';
import agent from '@mpieva/psydb-ui-request-agents';

const useWriteRequest = (
    createPromise,
    options = {}
) => {
    var {
        onSuccessfulUpdate,
        onFailedUpdate,
    } = options;
   
    var [ isTransmitting, setIsTransmitting ] = useState(false);

    var exec = (...args) => {
        setIsTransmitting(true);

        return createPromise(agent, ...args)
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

    return { isTransmitting, exec };
}

export default useWriteRequest;
