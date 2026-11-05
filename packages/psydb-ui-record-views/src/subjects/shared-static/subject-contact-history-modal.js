import React from 'react';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import SubjectContactHistoryList from './subject-contact-history-list';


const SubjectContactHistoryModalBody = (ps) => {
    var { modalPayloadData } = ps;
    var { subjectId } = modalPayloadData;

    return (
        <SubjectContactHistoryList subjectId={ subjectId } />
    )
}

const SubjectContactHistoryModal = WithDefaultModal({
    Body: SubjectContactHistoryModalBody,
    title: 'Contact History',
    size: 'lg',
    className: '',
    backdropClassName: '',
});

export default SubjectContactHistoryModal;
