import React from 'react';
import { Alert } from 'react-bootstrap';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const NoStudyTypesDefined = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <Alert variant='danger' { ...ps }>
            <b>{ translate('No study types defined!')}</b>
        </Alert>
    );
}
