import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, Row, Col } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    Fields,
    FormBox,
    useFormikContext,
} from '@mpieva/psydb-ui-lib';

const CreateNewType = (ps) => {
    var { onCreated } = ps;
    var translate = useUITranslation();

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
        <FormBox title={ translate('New Record Type') }>
            <DefaultForm
                initialValues={{ props: {
                    displayNameI18N: {},
                }}}
                onSubmit={ send.exec }
                useAjvAsync
                ajvErrorInstancePathPrefix = '/payload'
            >
                {(formikProps) => (
                    <>
                        <FormFields />
                        <Button type='submit'>
                            { translate('Save') }
                        </Button>
                    </>
                )}
            </DefaultForm>
        </FormBox>
    )
}

const FormFields = (ps) => {
    var { setFieldValue } = useFormikContext();
    var translate = useUITranslation();
    return (
        <>
            <Fields.GenericEnum
                label={ translate('Collection') }
                dataXPath='$.collection'
                enum={ enums.customRecordTypeCollections }
                required
            />
            <Fields.SaneString
                label={ translate('Display Name') }
                dataXPath='$.props.label'
                extraOnChange={ (next) => {
                    setFieldValue(
                        '$.type',
                        next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                    );
                }}
                required
            />
            <Fields.SaneString
                label={ translate('Display Name (DE)') }
                dataXPath='$.props.displayNameI18N.de'
            />
            <hr />
            <div className='px-3'>
                <small className='text-muted'>
                    { translate(
                        'The internal type key is generated automatically based on the display name but can be overridden manually.'
                    ) }
                </small>
            </div>
            <Fields.SaneString
                label={ translate('Internal Type Key') }
                dataXPath='$.type'
                required
            />
        </>
    )
}


export default CreateNewType;
