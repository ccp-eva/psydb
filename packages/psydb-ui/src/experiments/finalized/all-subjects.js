import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { DetailsIconButton } from '@mpieva/psydb-ui-layout';
import SubjectsContainer from '../subjects-container';

const AllSubjects = ({
    experimentData,
    labProcedureSettingData,
    studyData,
    subjectDataByType,
}) => {

    return (
        <SubjectsContainer { ...({
            className: 'p-3',
            experimentData,
            labProcedureSettingData,
            studyData,
            subjectDataByType,
            
            ActionsComponent,
        }) } />
    )
}

const ActionsComponent = ({
    experimentSubjectData,
    subjectRecord,

    hasContactIssue,
    isUnparticipated,
}) => {
    var permissions = usePermissions();
    return (
        <div className='d-flex justify-content-end'>
            { permissions.hasFlag('canReadSubjects') && (
                <DetailsIconButton
                    to={`/subjects/${subjectRecord.type}/${subjectRecord._id}`}
                />
            )}
        </div>
    )
}

export default AllSubjects;
