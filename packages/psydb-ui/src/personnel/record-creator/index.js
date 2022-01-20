import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from '../main-form';

const CreateForm = (ps) => {
    var { collection, onSuccessfulUpdate } = ps;
    var permissions = usePermissions();

    var send = useSendCreate({
        collection,
        onSuccessfulUpdate
    })

    var initialValues = {
        gdpr: {
            firstname: '',
            lastname: '',
            shorthand: '',
            emails: [{}],
            phones: [],
        },
        scientific: {
            researchGroupSettings: [{}],
            systemPermissions: {
                accessRightsByResearchGroup: [{}],
                isHiddenForResearchGroupIds: [],
            },
            canLogIn: false,
            hasRootAccess: false,
        },
    };

    return (
        <MainForm
            title='Neuer Mitarbeiter'
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });
