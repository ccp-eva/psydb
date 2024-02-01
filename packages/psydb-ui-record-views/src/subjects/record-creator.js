import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { withRecordCreator } from '../lib';
import MainForm from './main-form';

const CreateForm = (ps) => {
    var {
        collection,
        recordType,
        permissions,

        crtSettings,
        send,
        
        renderVisibilityButton = false,
    } = ps;

    var {
        fieldDefinitions,
        requiresTestingPermissions
    } = crtSettings;

    var translate = useUITranslation();

    var initialValues = MainForm.createDefaults({
        fieldDefinitions,
        requiresTestingPermissions,
        permissions
    });

    if (requiresTestingPermissions) {
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
    }

    return (
        <MainForm.Component
            title={ translate('New Subject') }
            crtSettings={ crtSettings }
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
            renderVisibilityButton={ renderVisibilityButton }
        />
    )
}

export const RecordCreator = withRecordCreator({
    Body: CreateForm,
    collection: 'subject',
});

