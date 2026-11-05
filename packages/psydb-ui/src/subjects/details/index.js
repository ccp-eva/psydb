import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import { RecordDetails } from '@mpieva/psydb-ui-record-views/subjects';

import Header from './header';

const SubjectDetailsContainer = ({
    type,
    collection,
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    var translate = useUITranslation();
    var permissions = usePermissions();

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canHistory = permissions.isRoot();
    var canWriteParticipation = permissions.hasFlag('canWriteParticipation');

    var canSelectSubjectsForExperiments = (
        permissions.hasSomeLabOperationFlags({
            types: [ 'inhouse', 'online-video-call', 'away-team' ],
            flags: [ 'canSelectSubjectsForExperiments' ]
        })
    );

    return (
        <>
            <div className='border pl-3 bg-light'>
                <Header
                    title={ translate('Subject Details') }
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
