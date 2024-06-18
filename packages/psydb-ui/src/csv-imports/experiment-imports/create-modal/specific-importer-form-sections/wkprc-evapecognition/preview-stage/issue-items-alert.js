import React from 'react';
import {
    Alert,
} from '@mpieva/psydb-ui-layout';

const IssueItemsAlert = (ps) => {
    var { invalid = [], unresolved = [] } = ps;

    return (
        <Alert variant='danger'>
            { invalid.length > 0 && (
                <b>InvalidItems</b>
            )}
            { unresolved.length > 0 && (
                <b>refIssueItems</b>
            )}
        </Alert>
    )
}

export default IssueItemsAlert;
