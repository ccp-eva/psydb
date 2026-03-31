import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import { EditIconButtonInline, SubjectIconButton }
    from '@mpieva/psydb-ui-layout';

import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';
import { Cell, getSubjectLabel, getStudyLabel } from './utils';

const SubjectCell = (ps) => {
    var {
        experimentRecord, subjectData, subjectCRT, related,
        onSuccessfulUpdate,
    } = ps;

    var { studyId } = experimentRecord.state;
    var { subjectId } = subjectData;
    
    var [{ translate }] = useI18N();

    var modal = useModalReducer();

    var permissions = usePermissions();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    var subjectLabel = getSubjectLabel({ related, subjectId });
    var studyLabel = getStudyLabel({ related, studyId });

    var onClickEdit = () => modal.handleShow({
        title: translate(
            'Postprocessing (${subject} - ${study})',
            { subject: subjectLabel, study: studyLabel }
        ),
        subjectCRT, subjectType: subjectCRT.getType(), // FIXME
        subjectId, experimentRecord, related,
    });

    return (
        <Cell>
            <DetailedPostprocessModal
                { ...modal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />

            { subjectLabel }
            { canWriteSubjects && (
                <EditIconButtonInline onClick={ onClickEdit } />
            )}
            { !canWriteSubjects && canReadSubjects && (
                <SubjectIconButton
                    to={`/subjects/${subjectType}/${subjectId}`}
                    target='_blank'
                />
            )}
        </Cell>
    )
}

export default SubjectCell;
