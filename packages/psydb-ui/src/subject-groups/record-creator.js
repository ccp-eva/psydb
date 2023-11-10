import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    var translate = useUITranslation();
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    var wrappedSend = (formData, formikBag) => {
        var { subjectType, props } = formData;
        return send.exec(props, formikBag, { subjectType })
    }

    var initialValues = MainForm.createDefaults();

    return (
        <MainForm.Component
            title={ translate('New Subject Group') }
            initialValues={ initialValues }
            onSubmit={ wrappedSend }
            permissions={ permissions }
            enableSubjectTypeSelect={ true }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

