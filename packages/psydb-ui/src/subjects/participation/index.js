import React from 'react';
import { useParams } from 'react-router-dom';

import { JsonBase64 } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUIConfig } from '@mpieva/psydb-ui-contexts';

import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { SubjectParticipationList } from '@mpieva/psydb-ui-lib';
import {
    CreateModal as ParticipationCreateModal
} from '@mpieva/psydb-ui-lib/src/participation/for-subject';

import Header from '../details/header';

const SubjectParticipation = (ps) => {
    var { recordType } = ps;

    var { id } = useParams();
    var translate = useUITranslation();
    var revision = useRevision();
    var permissions = usePermissions();
    var participationModal = useModalReducer();

    var canWriteParticipation = permissions.hasFlag('canWriteParticipation');
    var { dev_enableExtendedExperimentSearch = false } = useUIConfig();
    var canUseExperimentSearch = (
        dev_enableExtendedExperimentSearch
        && permissions.hasFlag('canUseExtendedSearch')
    );

    return (
        <div className='border pl-3 bg-light'>
            <ParticipationCreateModal
                { ...participationModal.passthrough }
                subjectId={ id }
                subjectRecordType={ recordType }
                onSuccessfulUpdate={ revision.up }
            />
            <Header
                title={ translate('Study Participation') }
                experimentSearchUrl={ canUseExperimentSearch && (
                    createExperimentSearchUrl({
                        subjectId: id, subjectType: recordType
                    })
                )}
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
    )
}

const createExperimentSearchUrl = (bag) => {
    var { subjectId, subjectType } = bag;
    var formData = JsonBase64.encode({
        specialFilters: { subjectType, subjectIds: [ subjectId ] },
        // NOTE: t-age is pruned in the columns tab when the
        // subject type has no date of birth field
        columns: [
            '/state/selectedSubjectIds',
            '/state/studyId',
            '/state/interval/start',
            '/_subject/_testingAge',
            '/state/locationId',
            '/type',
            '/_participationStatus',
        ],
    });
    return `/experiments/extended-search?tab=filters&formData=${formData}`;
}

export default SubjectParticipation;
