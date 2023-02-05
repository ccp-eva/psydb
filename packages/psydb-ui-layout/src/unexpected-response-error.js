import React from 'react';
import { Alert } from 'react-bootstrap';

export const UnexpectedResponseError = (ps) => {
    var { errorResponse } = ps;
    if (errorResponse?.data?.data?.stack) {
        errorResponse.data.data.stack = (
            errorResponse.data.data.stack.split("\n")
        )
    }
    return (
        <Alert variant='danger'>
            <pre>{ JSON.stringify(errorResponse, null, 4) }</pre>
        </Alert>
    );
}
