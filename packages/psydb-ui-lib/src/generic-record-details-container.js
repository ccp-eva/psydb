import React, { useState, useEffect, useReducer, forwardRef } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import LinkButton from './link-button';
import GenericRecordDetails from './generic-record-details';

const GenericRecordDetailsContainer = ({
    type,
    collection,
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    return (
        <div className='border pl-3 bg-light'>
            <h5 className='d-flex justify-content-between align-items-end'>
                <span>Datensatz-Details</span>
                <LinkButton to={ `${up(url, 1)}/edit` }>
                    Bearbeiten
                </LinkButton>
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
