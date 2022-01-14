import React from 'react';
import { useSendCreate, usePermissions } from '@mpieva/psydb-ui-hooks';
import { MainForm } from '../main-form';

const withRecordCreator = (options) => {
    var { CreateForm } = options;

    var RecordCreator = (ps) => {
        var { collection, recordType } = ps;

        var permissions = usePermissions();
        var canWrite = permissions.hasCollectionFlag(
            collection, 'write'
        );

        if (canWrite) {
            return <CreateForm { ...ps } />
        }
        else {
            return <PermissionDenied />
        }
    }

    return RecordCreator;
}

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
            emails: [],
            phones: [],
        },
        scientific: {
            researchGroupSettings: [],
            systemPermissions: {
                accessRightsByResearchGroup: [],
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
