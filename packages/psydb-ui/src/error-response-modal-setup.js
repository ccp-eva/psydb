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
                console.log('axios error');
                if (response && !config.disableErrorModal) {
                    errorResponseModal.handleShow(response);
                    throw error;
                }
                else {
                    throw error;
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
