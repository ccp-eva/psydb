import React from 'react';

import {
    Table
} from 'react-bootstrap';

const Subjects = ({
    experimentData,
    studyData,
    subjectDataByType
}) => {
    return (
        <div className='p-3'>
            <h5 className='border-bottom'>Kinder (1/5)</h5>
            <Table>
            </Table>
        </div>
    )
}

export default Subjects;
