import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, Row, Col } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    Fields,
    FormBox,
    useFormikContext,
    SchemaForm
} from '@mpieva/psydb-ui-lib';

const CreateNewType = ({ onCreated }) => {
    var onSuccessfulUpdate = (response) => {
        var recordId = response.data.data.find(it => (
            it.collectionName === 'customRecordType'
        )).channelId;

        onCreated && onCreated({
            id: recordId,
            response
        });
    }

    var send = useSend((formData) => ({
        type: 'custom-record-types/create',
        payload: { ...formData }
    }), { onSuccessfulUpdate });

    return (
        <FormBox title='Neuer Datensatz-Typ'>
            <DefaultForm
                initialValues={{ props: {} }}
                onSubmit={ send.exec }
                useAjvAsync
                ajvErrorInstancePathPrefix = '/payload'
            >
                {(formikProps) => (
                    <>
                        <FormFields />
                        <Button type='submit'>Speichern</Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    )
}

const FormFields = (ps) => {
    var { setFieldValue } = useFormikContext();
    return (
        <>
            <Fields.GenericEnum
                label='Collection'
                dataXPath='$.collection'
                enum={ enums.customRecordTypeCollections }
                required
            />
            <Fields.SaneString
                label='Anzeigename'
                dataXPath='$.props.label'
                extraOnChange={ (next) => {
                    setFieldValue(
                        '$.type',
                        next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                    );
                }}
                required
            />
            <hr />
            <div className='px-3'>
                <small className='text-muted'>
                    Der Interne Type-Key wird automatisch anhand des
                    Anzeigenamens generiert kann aber manuell
                    überschrieben werden.
                </small>
            </div>
            <Fields.SaneString
                label='Interner Type-Key'
                dataXPath='$.type'
                required
            />
        </>
    )
}


export default CreateNewType;
