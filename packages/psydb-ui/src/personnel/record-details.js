import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkButton } from '@mpieva/psydb-ui-layout';

import GenericRecordDetailsContainer from '@mpieva/psydb-ui-lib/src/generic-record-details-container';

export const RecordDetails = (ps) => {
    var { url } = useRouteMatch();
    var permissions = usePermissions();
    var isRoot = permissions.isRoot();

    return (
        <>
            <GenericRecordDetailsContainer { ...ps } />
            { isRoot && (
                <div className='mt-4 mb-4'>
                    <LinkButton
                        variant='danger'
                        to={`${up(url, 1)}/remove` }
                    >
                        Mitarbeiter Löschen
                    </LinkButton>
                </div>
            )}

        </>
    )
}
