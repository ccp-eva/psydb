import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const NoLocationTypesDefined = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger' { ...ps }>
            <b>{ translate('No location types defined!')}</b>
        </Alert>
    );
}
