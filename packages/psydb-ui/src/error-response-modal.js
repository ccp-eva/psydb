import React, { useEffect, useState } from 'react';
import { ErrorResponseModal } from '@mpieva/psydb-ui-lib';

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

export default WrappedErrorResponseModal;
