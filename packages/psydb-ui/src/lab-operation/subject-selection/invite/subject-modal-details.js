import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button, Alert } from '@mpieva/psydb-ui-layout';

import {
    RecordDetails,
    RecordEditor
} from '@mpieva/psydb-ui-record-views/subjects';


const SubjectModalDetails = (ps) => {
    var {
        recordType,
        id
    } = ps;

    var permissions = usePermissions();
    var canEdit = permissions.hasFlag('canWriteSubjects');
    var [ hasEdited, setHasEdited ] = useState(false);

    if (canEdit) {
        return (
            <div className='mt-3'>
                {
                    hasEdited
                    ? <HasEditedInfo onReEdit={ () => setHasEdited(false)}/>
                    : (
                        <RecordEditor
                            collection='subject'
                            recordType={ recordType }
                            id={ id }
                            renderFormBox={ false }
                            onSuccessfulUpdate={ () => setHasEdited(true) }
                        />
                    )
                }
            </div>
        )
    }
    else {
        return (
            <div className='mt-3 px-3'>
                <RecordDetails
                    collection='subject'
                    recordType={ recordType }
                    id={ id }
                />
            </div>
        )
    }
}

const HasEditedInfo = (ps) => {
    var { onReEdit } = ps;
    var translate = useUITranslation();
    
    return (
        <Alert variant='info' className='d-flex justify-content-between'>
            <i>{ translate('Subject data saved!') }</i>
            <a role='button' className='force-hover' onClick={ onReEdit }>
                <b>{ translate('Edit Again') }</b>
            </a>
        </Alert>
    );
}

export default SubjectModalDetails;
