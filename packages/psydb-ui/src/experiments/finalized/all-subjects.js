import React from 'react';
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
    return (
        <div className='d-flex justify-content-end'>
            <DetailsIconButton
                to={`/subjects/${subjectRecord.type}/${subjectRecord._id}`}
            />
        </div>
    )
}

export default AllSubjects;
