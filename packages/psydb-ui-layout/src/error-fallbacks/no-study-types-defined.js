import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const NoStudyTypesDefined = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger' { ...ps }>
            <b>{ translate('No study types defined!')}</b>
        </Alert>
    );
}
