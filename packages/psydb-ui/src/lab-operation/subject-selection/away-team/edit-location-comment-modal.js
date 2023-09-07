import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const CommentField = withField({
    Control: Fields.FullText.Control,
    DefaultWrapper: 'FieldWrapperMultiline'
});

const Body = (ps) => {
    var { onHide, modalPayloadData, onSuccessfulUpdate } = ps;
    var { locationId, locationLabel, locationComment } = modalPayloadData;

    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'location/change-comment',
        payload: { locationId, ...formData }
    }), {
        onSuccessfulUpdate: demuxed([
            onHide,
            onSuccessfulUpdate
        ])
    })

    return (
        <DefaultForm
            initialValues={{ comment: locationComment }}
            onSubmit={ send.exec }
            useAjvAsync
        >
            { (formikProps) => (
                <>
                    <div className='mb-3'>
                        { translate('Location') }
                        {': '}
                        <b>{ locationLabel }</b>
                    </div>
                    <CommentField
                        label={ translate('Comment') }
                        dataXPath='$.comment'
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


const EditLocationCommentModal = WithDefaultModal({
    title: 'Edit Location Comment',
    size: 'lg',
    Body,
});

export default EditLocationCommentModal;
