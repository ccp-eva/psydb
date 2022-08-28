import React from 'react';
import { withRecordCreator } from '../lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var {
        collection,
        recordType,
        permissions,

        crtSettings,
        send
    } = ps;

    var { fieldDefinitions } = crtSettings;

    var initialValues = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });

    initialValues.scientific.testingPermissions = [{
        permissionList: (
            [
                'inhouse',
                'online-video-call',
                'away-team',
                'online-survey'
            ].map(it => ({
                labProcedureTypeKey: it,
                value: 'unknown'
            }))
        )
    }];
    var [ primaryResearchGroupId ] = permissions.getResearchGroupIds();
    if (primaryResearchGroupId) {
        initialValues.scientific.testingPermissions[0].researchGroupId = (
            primaryResearchGroupId
        )
    }

    return (
        <MainForm.Component
            title='Neuer Proband:innen-Datensatz'
            crtSettings={ crtSettings }
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({
    Body: CreateForm,
    collection: 'subject',
});

