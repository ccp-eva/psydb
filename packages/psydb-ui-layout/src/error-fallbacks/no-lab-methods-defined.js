import React from 'react';
import { Alert } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const NoLabMethodsDefined = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger' { ...ps }>
            <b>{ translate('No lab workflows defined!')}</b>
        </Alert>
    );
}
