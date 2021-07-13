import React from 'react';
import enums from '@mpieva/psydb-schema-enums';

import SubjectList from './subject-list';

const SubjectTypeContainer = ({
    subjectTypeKey,
    subjectTypeLabel,
    subjectsPerExperiment,

    experimentData,
    fullSubjectData,
    
    ...other
}) => {
    var realSubjectCount = (
        experimentData.record.state.subjectData.filter(it => (
            !enums.unparticipationStatus.keys.includes(it.participationStatus)
        )).length
    )
    var showSubjectCount = (
        experimentData.record.type === 'inhouse'
    );

    return (
        <div>
            <h5 className=''>
                { subjectTypeLabel }
                { showSubjectCount && (
                    ` (${realSubjectCount}/${subjectsPerExperiment})`
                )}
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
