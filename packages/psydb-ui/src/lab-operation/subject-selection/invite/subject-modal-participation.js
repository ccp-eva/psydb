import React from 'react';
import { SubjectParticipationList } from '@mpieva/psydb-ui-lib';

const SubjectModalParticipation = (ps) => {
    var { id, recordType } = ps;
    return (
        <SubjectParticipationList
            id={ id }
            subjectType={ recordType }
            enableItemFunctions={ false }
        />
    )
}

export default SubjectModalParticipation;

