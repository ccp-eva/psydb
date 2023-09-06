import React from 'react';
import { SubjectParticipationList } from '@mpieva/psydb-ui-lib';

const SubjectModalParticipation = (ps) => {
    var { id, recordType } = ps;
    return (
        <div className='my-2'>
            <SubjectParticipationList
                id={ id }
                subjectType={ recordType }
                enableItemFunctions={ false }
            />
        </div>
    )
}

export default SubjectModalParticipation;

