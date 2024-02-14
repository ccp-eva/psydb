import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const NoSubjectTypesDefined = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger' { ...ps }>
            <b>{ translate('No subject types defined!')}</b>
        </Alert>
    );
}
