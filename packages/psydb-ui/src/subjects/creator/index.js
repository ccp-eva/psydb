import React from 'react';
import { RecordCreator } from '@mpieva/psydb-ui-record-views/subjects';


const SubjectCreatorContainer = ({
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    var creatorBag = {
        id, collection, recordType,
        onSuccessfulUpdate, onFailedUpdate
    };

    var handleDuplicate = () => {}
    return (
        <RecordCreator { ...creatorBag }>
            {() => {
                return (
                    <div>FOOOOOOOO</div>
                );
            }}
        </RecordCreator>
    );
}

export default SubjectCreatorContainer;
