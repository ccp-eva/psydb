import React from 'react';
import { useParams } from 'react-router-dom';

import GenericRecordForm from './generic-record-form';

const GenericRecordFormContainer = ({
    type,
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    
    var id = undefined;
    if (type === 'edit') {
        ({ id } = useParams());
    }

    return (
        <div className='border p-3 bg-light'>
            <h5>
                { 
                    type === 'edit'
                    ? 'Datensatz bearbeiten'
                    : 'Neuer Datensatz'
                }
            </h5>
            <hr />
            <GenericRecordForm { ...({
                type,
                collection,
                recordType,
                id,
                onSuccessfulUpdate,
            })} />
        </div>
    )
}

export default GenericRecordFormContainer;
