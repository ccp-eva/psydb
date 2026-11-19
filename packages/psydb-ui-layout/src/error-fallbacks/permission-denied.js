import React from 'react';
import { Alert } from 'react-bootstrap';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const PermissionDenied = (ps) => {
    var [{ translate }] = useI18N();

    return (
        <Alert { ...ps } variant='danger'>
            <b>{ translate('Permission Denied') }</b>
        </Alert>
    )
}
