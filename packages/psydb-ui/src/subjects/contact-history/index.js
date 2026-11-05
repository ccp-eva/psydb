import React from 'react';
import { useParams } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SubjectContactHistoryList }
    from '@mpieva/psydb-ui-record-views/subjects';

import Header from '../details/header';

const SubjectContactHistory = (ps) => {
    var { id } = useParams();
    var translate = useUITranslation();

    return (
        <div className='border pl-3 bg-light'>
            <Header title={ translate('Contact History') } />
            <hr />
            <div className='pr-3 pb-3'>
                <SubjectContactHistoryList subjectId={ id } />
            </div>
        </div>
    )
}

export default SubjectContactHistory;
