import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import Participation from './participation';
import {
    CreateModal as ParticipationCreateModal
} from '@mpieva/psydb-ui-lib/src/participation';

import { RecordDetails } from '@mpieva/psydb-ui-record-views/subjects';

const Header = ({
    title,
    editLabel,
    editUrl,
    onEditClick,
    canEdit,
    canAccessExtraFunctions,
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
            { /* canAccessExtraFunctions && (
                <ExtraFunctionsDropdown>
                    { }
                </ExtraFunctionsDropdown>
            )*/}
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
    
    var canAccessExtraFunctions = (
        canWriteParticipation
        || permissions.hasSomeLabOperationFlags({
            types: [ 'inhouse', 'online-video-call', 'away-team' ],
            flags: [ 'canSelectSubjjectsForExperiments' ]
        })
    );

    return (
        <>
            <h3 className='border-bottom'>Proband:innen-Details</h3>
            <div className='border pl-3 bg-light'>
                <Header
                    title='Erfasste Daten'
                    editUrl={ `${up(url, 1)}/edit` }
                    canEdit= { canEdit }
                    canAccessExtraFunctions={ canAccessExtraFunctions }
                />
                <hr />
                
                <RecordDetails { ...({
                    id,
                    collection,
                    recordType,
                })} />
            </div>
            
            { canReadParticipation && (
                <div className='border pl-3 bg-light mt-4 mb-4'>
                    <ParticipationCreateModal
                        { ...participationModal.passthrough }
                        subjectId={ id }
                        subjectRecordType={ recordType }
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
                        <Participation
                            id={ id }
                            subjectType={ recordType }
                            revision={ revision }
                        />
                    </div>
                </div>
            )}

            { /*isRoot && (
                <div className='mb-4'>
                    <LinkButton
                        variant='danger'
                        to={`${up(url, 1)}/remove` }
                    >
                        Proband:in Löschen
                    </LinkButton>
                </div>
            )*/}

        </>
    )
}

export default SubjectDetailsContainer;
