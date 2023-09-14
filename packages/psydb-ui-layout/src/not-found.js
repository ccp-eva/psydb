import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
export const NotFound = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger'>
            <b>{ translate('Record not found!') }</b>
        </Alert>
    )
}
