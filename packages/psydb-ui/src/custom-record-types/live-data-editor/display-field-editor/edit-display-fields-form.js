import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    FormBox,
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
});

const EditDisplayFieldForm = ({
    target,
    record,
    currentDataPointers,
    availableFieldDataByPointer,
    onSuccess,
}) => {

    var send = useSend((formData) => ({
        type: 'custom-record-types/set-display-fields',
        payload: {
            target,
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
            fieldPointers: formData.columns,
        }
    }), { onSuccessfulUpdate: onSuccess });

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
                    <ColumnSelect
                        columnLabel='Spaltenauswahl'
                        orderLabel='Anordnung'
                        dataXPath='$.columns'
                        columns={ columns }
                    />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );
}

export default EditDisplayFieldForm;
