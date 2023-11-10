import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
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
            title='Neue Proband:innen-Gruppe'
            initialValues={ initialValues }
            onSubmit={ wrappedSend }
            permissions={ permissions }
            enableSubjectTypeSelect={ true }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

