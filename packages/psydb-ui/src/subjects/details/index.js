import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import GenericRecordDetails from '@mpieva/psydb-ui-lib/src/generic-record-details';
import Participation from './participation';
import ParticipationModal from './participation-modal';

import { RecordDetails } from '@mpieva/psydb-ui-record-views/subjects';

const Header = ({
    title,
    editLabel,
    editUrl,
    onEditClick,
    canEdit,
}) => {
    var { path, url } = useRouteMatch();

    title = title || 'Datensatz-Details';
    editLabel = editLabel || 'Bearbeiten';

    return (
        <h5 className='d-flex justify-content-between align-items-start'>
            <span className='d-inline-block pt-3'>{ title }</span>
            { canEdit && editUrl && (
                <LinkButton to={ editUrl }>
                    { editLabel }
                </LinkButton>
            )}
            { canEdit && onEditClick && (
                <Button onClick={ onEditClick }>
                    { editLabel }
                </Button>
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
    var revision = useRevision();
    var permissions = usePermissions();
    var participationModal = useModalReducer();

    var isRoot = permissions.isRoot();
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
                
                <RecordDetails { ...({
                    id,
                    collection,
                    recordType,
                })} />

                { /*<GenericRecordDetails { ...({
                    id,
                    collection,
                    recordType,
                })} /> */}
            </div>
            
            { canReadParticipation && (
                <div className='border pl-3 bg-light mt-4 mb-4'>
                    <ParticipationModal
                        { ...participationModal.passthrough }
                        subjectId={ id }
                        onSuccessfulUpdate={ revision.up }
                    />
                    <Header
                        title='Studienteilnahme'
                        editLabel='Studie hinzufügen'
                        canEdit={ canWriteParticipation }
                        onEditClick={ () => (
                            participationModal.handleShow()
                        )}
                    />
                    <hr />
                    <div className='pr-3 pb-3'>
                        <Participation id={ id } revision={ revision } />
                    </div>
                </div>
            )}

            { isRoot && (
                <div className='mb-4'>
                    <LinkButton
                        variant='danger'
                        to={`${up(url, 1)}/remove` }
                    >
                        Proband Löschen
                    </LinkButton>
                </div>
            )}

        </>
    )
}

export default SubjectDetailsContainer;
