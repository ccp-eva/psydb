import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { LinkButton } from '@mpieva/psydb-ui-layout';
import GenericRecordDetails from '@mpieva/psydb-ui-lib/src/generic-record-details';
import Participation from './participation';

const Header = ({
    title,
    editLabel,
    editUrl,
    canEdit,
}) => {
    var { path, url } = useRouteMatch();

    title = title || 'Datensatz-Details';
    editLabel = editLabel || 'Bearbeiten';

    return (
        <h5 className='d-flex justify-content-between align-items-end'>
            <span className='d-inline-block pt-3'>{ title }</span>
            { canEdit && (
                <LinkButton to={ editUrl }>
                    { editLabel }
                </LinkButton>
            )}
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
    var permissions = usePermissions();

    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canWriteParticipation = permissions.hasFlag('canWriteParticipation');

    return (
        <>
            <h3 className='border-bottom'>Kinder-Details</h3>
            <div className='border pl-3 bg-light'>
                <Header
                    title='Erfasste Daten'
                    editUrl={ `${up(url, 1)}/edit` }
                    canEdit= { canEdit }
                />
                <hr />
                
                <GenericRecordDetails { ...({
                    id,
                    collection,
                    recordType,
                })} />
            </div>
            
            { canReadParticipation && (
                <div className='border pl-3 bg-light mt-4'>
                    <Header
                        title='Studienteilnahme'
                        editUrl={ `${up(url, 1)}/edit` }
                        canEdit={ canWriteParticipation }
                    />
                    <hr />
                    <div className='mr-3'>
                        <Participation id={ id } />
                    </div>
                </div>
            )}

        </>
    )
}

export default SubjectDetailsContainer;
