import React from 'react';
import SubjectList from './subject-list';

const SubjectTypeContainer = ({
    isMultiTypeExperiment,

    subjectTypeKey,
    subjectTypeLabel,
    subjectsPerExperiment,

    experimentData,
    fullSubjectData,
    
    ...other
}) => {

    var todoSubjects = (
        experimentData.record.state.subjectData.filter(it => (
            it.participationStatus === 'unknown'
        ))
    );

    var todoSubjectCount = todoSubjects.length;
    if (todoSubjectCount < 1) {
        return null;
    }

    return (
        <div>
            { isMultiTypeExperiment && (
                <h5 className=''>
                    { subjectTypeLabel }
                </h5>
            )}
            <SubjectList { ...({
                experimentRecord: experimentData.record,
                ...fullSubjectData,
                ...other
            }) } />
        </div>
    )
}

export default SubjectTypeContainer;
