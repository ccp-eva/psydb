import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withField } from '@cdxoo/formik-utils';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const ColumnField = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
});

const Body = (ps) => {
    var { id, crt, onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    
    var translate = useUITranslation();
    
    var { duplicateCheckSettings = {} } = crt.getRaw();
    var { fieldSettings = [] } = duplicateCheckSettings;

    var send = useSend((formData) => ({
        type: 'custom-record-types/set-duplicate-check-settings',
        payload: { id, fieldSettings: (
            formData.columns.map(it => ({ pointer: it, props: {} }))
        )}
    }), {
        onSuccessfulUpdate: demuxed([
            onHide,
            onSuccessfulUpdate
        ])
    })

    return (
        <DefaultForm
            initialValues={{ columns: fieldSettings.map(it => it.pointer) }}
            onSubmit={ send.exec }
            useAjvAsync
        >
            { (formikProps) => (
                <>
                    <ColumnField
                        columnLabel={ translate('Fields') }
                        dataXPath='$.columns'
                        columns={(
                            crt
                            .findCustomFields({
                                type: { $in: [
                                    'SaneString',
                                    'BiologicalGender',
                                    'DateOnlyServerSide'
                                ]}
                            })
                            .map(it => ({
                                pointer: it.pointer,
                                label: it.displayName
                            }))
                        )}
                        enableColumnOrder={ false }
                    />
                    <div className='mt-3 d-flex justify-content-end'>
                        <Button size='sm' type='submit'>
                            { translate('Save') }
                        </Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}


const EditDuplicateCheckFieldsModal = WithDefaultModal({
    title: 'Fields for Duplication Check',
    size: 'lg',
    Body,
});

export default EditDuplicateCheckFieldsModal;
