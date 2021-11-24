import React, { useState, useEffect, useReducer, forwardRef } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { LinkButton } from '@mpieva/psydb-ui-layout';
import GenericRecordDetails from './generic-record-details';

const GenericRecordDetailsContainer = ({
    type,
    collection,
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    var permissions = usePermissions();

    var canRead = permissions.hasCollectionFlag(collection, 'read');
    var canEdit = permissions.hasCollectionFlag(collection, 'write');

    if (!canRead) {
        return <PermissionDenied />
    }

    return (
        <div className='border pl-3 bg-light'>
            <h5 className='d-flex justify-content-between align-items-start'>
                <span className='d-inline-block pt-3'>Datensatz-Details</span>
                { canEdit && (
                    <LinkButton to={ `${up(url, 1)}/edit` }>
                        Bearbeiten
                    </LinkButton>
                )}
            </h5>
            <hr />
            
            <GenericRecordDetails { ...({
                id,
                collection,
                recordType,
            })} />

        </div>
    )
}

export default GenericRecordDetailsContainer;
