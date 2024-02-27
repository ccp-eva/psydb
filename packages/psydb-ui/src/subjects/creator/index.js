import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { RecordCreator } from '@mpieva/psydb-ui-record-views/subjects';
import HandleDuplicateModal from './handle-duplicate-modal';


const SubjectCreatorContainer = ({
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    var duplicateModal = useModalReducer();

    var onFailedUpdate = (error, args) => {
        var [ formData, formikForm ] = args;
        var { apiStatus, data } = error.response.data;
        if (apiStatus === 'DuplicateSubject') {
            duplicateModal.handleShow({ responseData: data, formikForm });
        }
        else {
            throw error
        }
    }

    var creatorBag = {
        collection, recordType,
        onSuccessfulUpdate, onFailedUpdate
    };

    return (
        <>
            <HandleDuplicateModal
                { ...duplicateModal.passthrough }
                recordType={ recordType }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <RecordCreator
                { ...creatorBag }
                renderVisibilityButton={ true }
                disableErrorModal={[ 409 ]}
            />
        </>
    );
}

export default SubjectCreatorContainer;
