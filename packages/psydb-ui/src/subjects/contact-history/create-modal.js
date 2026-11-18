import React, { useEffect } from 'react';
import { useUITranslation, useSelf } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    AsyncButton,
    SmallFormFooter
} from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields, useFormikContext }
    from '@mpieva/psydb-ui-lib';

var statusesForType = {
    'email': [ 'sent', 'delivered' ],
    'phone': [ 'contact-successful', 'mailbox', 'contact-failed' ],
};

const CreateModalBody = (ps) => {
    var { subjectId, onHide, onSuccessfulUpdate } = ps;
    var self = useSelf();

    var send = useSend((formData) => ({
        type: 'subject-contact-history/create',
        payload: { subjectId, props: formData }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    var initialValues = {
        type: 'phone',
        contactedAt: new Date().toISOString(),
        contactedBy: self.record._id,
        status: 'contact-successful',
        comment: '',
    };

    return (
        <Form
            initialValues={ initialValues }
            { ...send.passthrough }
        />
    );
}

const Form = (ps) => {
    var { initialValues, onSubmit, isTransmitting } = ps;
    var translate = useUITranslation();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix={ '/payload/props' }
        >
            {(formikProps) => (
                <>
                    <FormFields />
                    <SmallFormFooter extraClassName='pt-2'>
                        <AsyncButton
                            type='submit'
                            isTransmitting={ isTransmitting }
                        >
                            { translate('Save') }
                        </AsyncButton>
                    </SmallFormFooter>
                </>
            )}
        </DefaultForm>
    )
}

const FormFields = () => {
    var translate = useUITranslation();
    var { getFieldProps, setFieldValue } = useFormikContext();
    var { value: type } = getFieldProps('$.type');
    var { value: status } = getFieldProps('$.status');

    var allowedStatuses = statusesForType[type] || [];
    useEffect(() => {
        if (!allowedStatuses.includes(status)) {
            setFieldValue('$.status', allowedStatuses[0]);
        }
    }, [ type ]);

    var typeOptions = Object.keys(statusesForType).reduce((acc, it) => ({
        ...acc, [it]: translate(`_subjectContactType_${it}`)
    }), {});
    var statusOptions = allowedStatuses.reduce((acc, it) => ({
        ...acc, [it]: translate(`_subjectContactStatus_${it}`)
    }), {});

    return (
        <>
            <Fields.GenericEnum
                label={ translate('Type') }
                dataXPath='$.type'
                options={ typeOptions }
            />
            <Fields.DateTime
                label={ translate('Contacted At') }
                dataXPath='$.contactedAt'
            />
            <Fields.ForeignId
                label={ translate('Contacted By') }
                dataXPath='$.contactedBy'
                collection='personnel'
            />
            <Fields.GenericEnum
                label={ translate('Status') }
                dataXPath='$.status'
                options={ statusOptions }
            />
            <Fields.SaneString
                label={ translate('Comment') }
                dataXPath='$.comment'
            />
        </>
    )
}

const CreateModal = WithDefaultModal({
    title: 'Log Contact',
    size: 'lg',
    Body: CreateModalBody,
});

export default CreateModal;
