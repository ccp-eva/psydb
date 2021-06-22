import React, { createContext, useContext } from 'react';
import DetailsIconButton from '@mpieva/psydb-ui-lib/src/details-icon-button';
import SubjectsContainer from '../subjects-container';

const ActionsContext = createContext({});

const AllSubjects = ({
    experimentData,
    studyData,
    subjectDataByType,
}) => {

    return (
        <ActionsContext.Provider>
            <SubjectsContainer { ...({
                experimentData,
                studyData,
                subjectDataByType,
                
                ActionsComponent,
            }) } />
        </ActionsContext.Provider>
    )
}

const ActionsComponent = ({
    experimentSubjectData,
    subjectRecord,

    hasContactIssue,
    isUnparticipated,
}) => {
    var context = useContext(ActionsContext);
    return (
        <>
            <DetailsIconButton
                to={`/subjects/${subjectRecord.type}/${subjectRecord._id}`}
            />
        </>
    )
}

export default AllSubjects;
