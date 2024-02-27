import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const PermissionDenied = (ps) => {
    var translate = useUITranslation();

    return (
        <Alert { ...ps } variant='danger'>
            <b>{ translate('Permission Denied') }</b>
        </Alert>
    )
}
