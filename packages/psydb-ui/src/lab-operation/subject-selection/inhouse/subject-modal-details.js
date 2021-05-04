import React, { useState, useEffect, useReducer } from 'react';

import GenericRecordDetails from '@mpieva/psydb-ui-lib/src/generic-record-details';

const SubjectModalDetails = ({
    recordType,
    id
}) => {
    return (
        <div className='p-3' style={{ paddingRight: '250px' }}>
            <GenericRecordDetails
                collection='subject'
                recordType={ recordType }
                id={ id }
            />
        </div>
    )
}

export default SubjectModalDetails;
