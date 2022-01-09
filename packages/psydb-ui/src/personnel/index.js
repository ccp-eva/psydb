import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import GenericRecordFormContainer from '@mpieva/psydb-ui-lib/src/generic-record-form-container';

import { RecordEditor } from './record-editor';

const PersonnelTypeView = withRecordTypeView({
    RecordEditor: (ps) => {

        var setPasswordModal = useModalReducer();
        return (
            <>
                <RecordEditor { ...ps } />
                {/*<GenericRecordFormContainer { ...ps } />*/}
                { /*<div className='mt-4 mb-4 bg-light border p-3'>
                    <div>
                        <button
                            className='btn btn-link p-0'
                            onClick={ setPasswordModal.handleShow }
                        >
                            Passwort ändern
                        </button>
                    </div>
                </div> */}
            </>
        )
    }
})

const PersonnelCollectionView = withCollectionView({
    collection: 'personnel',
    RecordTypeView: PersonnelTypeView
});

const Personnel = () => {
    return (
        <PersonnelCollectionView />
    );
}


export default Personnel;
