import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import up from '@mpieva/psydb-ui-lib/src/url-up';
import LinkButton from '@mpieva/psydb-ui-lib/src/link-button';
import GenericRecordDetails from '@mpieva/psydb-ui-lib/src/generic-record-details';
import Participation from './participation';

const Header = ({
    title,
    editLabel,
    editUrl
}) => {
    var { path, url } = useRouteMatch();

    title = title || 'Datensatz-Details';
    editLabel = editLabel || 'Bearbeiten';

    return (
         <h5 className='d-flex justify-content-between align-items-end'>
            <span>{ title }</span>
            <LinkButton to={ editUrl }>
                { editLabel }
            </LinkButton>
        </h5>
    )
}

const SubjectDetailsContainer = ({
    type,
    collection,
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    return (
        <>
            <h3>Kinder-Details</h3>
            <div className='border pl-3 bg-light'>
                <Header
                    title='Erfasste Daten'
                    editUrl={ `${up(url, 1)}/edit` }
                />
                <hr />
                
                <GenericRecordDetails { ...({
                    id,
                    collection,
                    recordType,
                })} />
            </div>
            
            <div className='border pl-3 bg-light mt-4'>
                <Header
                    title='Studienteilnahme'
                    editUrl={ `${up(url, 1)}/edit` }
                />
                <hr />
                <Participation id={ id } />
            </div>

        </>
    )
}

export default SubjectDetailsContainer;
