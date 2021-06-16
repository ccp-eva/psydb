import React from 'react';

import SubjectList from './subject-list';

const SubjectTypeContainer = ({
    subjectTypeKey,
    subjectTypeLabel,
    subjectsPerExperiment,

    experimentData,
    fullSubjectData,
    
    ...other
}) => {
    return (
        <div>
            <h5 className=''>
                { subjectTypeLabel }
                {' '}
                (
                    { fullSubjectData.records.length }
                    /
                    { subjectsPerExperiment }
                )
            </h5>
            <SubjectList { ...({
                experimentRecord: experimentData.record,
                ...fullSubjectData,
                ...other
            }) } />
        </div>
    )
}

export default SubjectTypeContainer;
