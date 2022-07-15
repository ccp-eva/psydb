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

    var [ primaryResearchGroupId ] = permissions.getResearchGroupIds();
    if (primaryResearchGroupId) {
        initialValues.scientific.testingPermissions = [
            {
                researchGroupId: primaryResearchGroupId,
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
            }
        ]
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

