import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import { SubjectParticipationList } from '@mpieva/psydb-ui-lib';
import {
    CreateModal as ParticipationCreateModal
} from '@mpieva/psydb-ui-lib/src/participation/for-subject';


import SelectSubjectContainer from './select-subject-container';

import { RecordDetails } from '@mpieva/psydb-ui-record-views/subjects';

const Header = ({
    title,
    editLabel,
    editUrl,
    onEditClick,
    canEdit,
    
    historyLabel,
    historyUrl,
    canHistory,

    subjectId,
    subjectType,
    canWriteParticipation,
    canSelectSubjects,
    canSelectSubjectsForExperiments,
}) => {
    var { path, url } = useRouteMatch();
    var translate = useUITranslation();

    title = title || translate('Record Details');
    editLabel = editLabel || translate('Edit');
    historyLabel = historyLabel || translate('History');

    return (
        <h5 className='d-flex justify-content-between align-items-start'>
            <span className='d-inline-block pt-3'>{ title }</span>
            <div>
                { canHistory && historyUrl && (
                    <LinkButton className='mr-3' to={ historyUrl }>
                        { historyLabel }
                    </LinkButton>
                )}
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
                {  canSelectSubjectsForExperiments && (
                    <SelectSubjectContainer
                        className='ml-3'
                        subjectId={ subjectId }
                        subjectType={ subjectType }
                    />
                )}
            </div>
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
    var translate = useUITranslation();
    var revision = useRevision();
    var permissions = usePermissions();
    var participationModal = useModalReducer();

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canHistory = permissions.isRoot();
    var canReadParticipation = permissions.hasFlag('canReadParticipation');
    var canWriteParticipation = permissions.hasFlag('canWriteParticipation');

    var canSelectSubjectsForExperiments = (
        permissions.hasSomeLabOperationFlags({
            types: [ 'inhouse', 'online-video-call', 'away-team' ],
            flags: [ 'canSelectSubjectsForExperiments' ]
        })
    );

    return (
        <>
            <h3 className='border-bottom'>
                { translate('Subject Details') }
            </h3>
            <div className='border pl-3 bg-light'>
                <Header
                    title={ translate('Collected Data') }
                    editUrl={ `${up(url, 1)}/edit` }
                    historyUrl={ `${up(url, 1)}/channel-history` }
                    subjectId={ id }
                    subjectType={ recordType }
                    canEdit= { canEdit }
                    canHistory= { canHistory }
                    canWriteParticipation={ canWriteParticipation }
                    canSelectSubjectsForExperiments={ canSelectSubjectsForExperiments }
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
                        title={ translate('Study Participation') }
                        editLabel={ translate('Add Participation') }
                        canEdit={ canWriteParticipation }
                        onEditClick={ () => (
                            participationModal.handleShow()
                        )}
                    />
                    <hr />
                    <div className='pr-3 pb-3'>
                        <SubjectParticipationList
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
