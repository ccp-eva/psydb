import React from 'react';
import sift from 'sift';
import { keyBy } from '@mpieva/psydb-core-utils';

import {
    convertCRTRecordToSettings,
    CRTSettings
} from '@mpieva/psydb-common-lib';

import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import FieldPointerList from '../field-pointer-list';
import Modal from './modal';

const DuplicateCheckFieldEditor = (ps) => {
    var { record, onSuccessfulUpdate } = ps;
    var modal = useModalReducer();

    var crtSettings = convertCRTRecordToSettings(record);
    var crt = CRTSettings({ data: crtSettings });
    var { duplicateCheckSettings = {} } = crt.getRaw();
    var { fieldSettings = [] } = duplicateCheckSettings;

    var availableFieldDataByPointer = keyBy({
        items: crt.allCustomFields(),
        byProp: 'pointer'
    });

    return (
        <div>
            <Modal crt={ crt } { ...modal.passthrough } />
            <FieldPointerList
                dataPointers={ fieldSettings.map(it => it.pointer) }
                availableFieldDataByPointer={
                    availableFieldDataByPointer
                }
            />
            <Button onClick={ modal.handleShow }>
                Edit
            </Button>
        </div>
    )
}

export default DuplicateCheckFieldEditor;
