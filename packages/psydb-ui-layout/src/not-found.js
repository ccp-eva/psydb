import React from 'react';
import { Alert } from 'react-bootstrap';
import { useI18N } from '@mpieva/psydb-ui-contexts';
export const NotFound = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <Alert variant='danger'>
            <b>{ translate('Record not found!') }</b>
        </Alert>
    )
}
