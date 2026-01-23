import { useState, useEffect } from 'react';
import { PublicAgent } from '@mpieva/psydb-ui-request-agents';

const initStateFromAPI = (bag) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ state, setState ] = useState({});

    var {
        authCurrentStatus = 401,
        authResponseStatus = undefined,
        self, config = {}
    } = state;
    
    var onSuccessfulUpdate = (response) => {
        // FIXME: find better way to determine logout
        var data = response?.data?.data;
        if (data?.authStatusCode) {
            setState({
                self: data.self,
                authCurrentStatus: data.authStatusCode,
                authResponseStatus: undefined,
                config: data.config,
            })
        }
        else if (data?.record) {
            setState({
                self: response.data.data,
                authCurrentStatus: response.status,
                config,
            });
        }
        else {
            // NOTE: reset auth status on logout /api/self on logout
            setState({ config });
        }
    }

    var onFailedUpdate = (error) => {
        var statusCode = error.response?.status;
        if (statusCode) {
            setState({
                authCurrentStatus: statusCode,
                authResponseStatus: statusCode,
                config,
            });
        }
        else {
            throw error;
        }
    }
    var is200 = (authCurrentStatus === 200);
    useEffect(() => {
        setIsInitialized(false)
        PublicAgent.get('/api/init-ui').then(
            (response) => {
                onSuccessfulUpdate(response);
                setIsInitialized(true);
            },
            (error) => {
                onFailedUpdate(error);
                setIsInitialized(true);
            }
        )
    }, [ is200 ]);

    var setSelf = (next) => setState((state) => ({ ...state, self: next }));

    return {
        isInitialized, 
        config,
        authCurrentStatus, authResponseStatus,
        self, setSelf,

        // NOTE: sign-out will trigger onSuccessfulUpdate()
        onSuccessfulUpdate,
        onFailedUpdate,
    }
}

export default initStateFromAPI;
