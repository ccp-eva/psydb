import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib';


const ColumnOrder = withField({
    Control: Fields.ColumnOrder.Control,
    DefaultWrapper: 'NoneWrapper'
});

const EditFormOrderModalBody = (ps) => {
    var {
        recordId,
        currentDataPointers,
        availableFieldDataByPointer,
        onHide,
        onSuccessfulUpdate,
    } = ps;
    
    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'custom-record-types/set-form-order',
        payload: {
            id: recordId,
            formOrder: formData.columns,
        }
    }), { onSuccessfulUpdate: [ onSuccessfulUpdate, onHide ]});

    var columns = (
        Object.keys(availableFieldDataByPointer)
        .reduce((acc, key) => {
            var {
                pointer, dataPointer, displayName
            } = availableFieldDataByPointer[key];
            pointer = pointer || dataPointer; // FIXME
            return [ ...acc, { pointer, label: displayName } ];
        }, [])
    );

    return (
        <DefaultForm
            initialValues={{ columns: currentDataPointers }}
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <ColumnOrder
                        dataXPath='$.columns'
                        columns={ columns }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    );
};

const EditFormOrderModal = WithDefaultModal({
    title: 'Field Order in Forms',
    size: 'lg',
    Body: EditFormOrderModalBody
});

export default EditFormOrderModal;
