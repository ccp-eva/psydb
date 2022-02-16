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

const EditDefinitionForm = (ps) => {
    var {
        record,
        format,
        tokens,
        availableFieldDataByPointer,
        onSuccess,
    } = ps;
    
    var send = useSend((formData) => ({
        type: 'custom-record-types/set-record-label-definition',
        payload: {
            id: record._id,
            lastKnownEventId: record._lastKnownEventId,
            props: {
                format: formData.format,
                tokens: formData.tokens
            }
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

    var initialValues = {
        format,
        tokens: tokens.map(it => it.dataPointer),
    }

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        labelClassName='px-0'
                        label='Anzeige-Format'
                        dataXPath='$.format'
                    />
                    <ColumnSelect
                        columnLabel='Platzhalterauswahl'
                        orderLabel='Anordnung'
                        dataXPath='$.tokens'
                        columns={ columns }
                    />
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    );
}

export default EditDefinitionForm;
