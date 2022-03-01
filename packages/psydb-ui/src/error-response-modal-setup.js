import React, { useContext } from 'react';
import { AgentContext } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { ErrorResponseModal } from '@mpieva/psydb-ui-lib';

const ErrorResponseModalSetup = (ps) => {
    var agent = useContext(AgentContext);
    var errorResponseModal = useModalReducer();

    if (agent.getAxios().interceptors.response.handlers.length === 0) {
        agent.getAxios().interceptors.response.use(
            (response) => (response),
            (error) => {
                var { config, response } = error;
                var { status } = response;
                var { disableErrorModal } = config;

                console.log('axios error', status);
                if (response && !disableErrorModal) {
                    errorResponseModal.handleShow(response);
                    throw error;
                }
                else {
                    if (disableErrorModal === true) {
                        throw error;
                    }
                    else {
                        var codes = (
                            Array.isArray(disableErrorModal)
                            ? disableErrorModal
                            : [ disableErrorModal ]
                        );
                        if (codes.includes(status)) {
                            throw error;
                        }
                        else {
                            errorResponseModal.handleShow(response);
                            throw error;
                        }
                    }
                }
            }
        );
    }

    return (
        <WrappedErrorResponseModal
            { ...errorResponseModal.passthrough }
        />
    )
}

const WrappedErrorResponseModal = (ps) => {
    var { modalPayloadData: apiError, ...downstream } = ps;
    if (!apiError) {
        return null;
    }
    return (
        <ErrorResponseModal
            { ...downstream }
            errorResponse={ apiError }
        />
    )
}

export default ErrorResponseModalSetup;
