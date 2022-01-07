import React from 'react';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

const defaultValues = {
    name: '',
    parentId: null,
}

export const TopicForm = (ps) => {
    var {
        op,
        record,
        parentId,
        onSuccessfulUpdate
    } = ps;

    var recordId, lastKnownEventId, recordState;
    if (record) {
        ({
            _id: recordId,
            _lastKnownEventId: lastKnownEventId,
            state: recordState,
        } = record)
    }

    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var send = useSend((formData, formikProps) => {
        var type = `studyTopic/${op}`;
        var message;
        switch (op) {
            case 'create':
                message = { type, payload: { props: {
                    ...formData,
                    parentId, // force the parentId from component props
                }}};
                break;
            case 'patch':
                message = { type, payload: {
                    id: recordId,
                    lastKnownEventId,
                    props: formData['$']
                }};
                break;
            default:
                throw new Error(`unknown op "${op}"`);
        }
        return message;
    }, { onSuccessfulUpdate });

    return (
        <div>
            <DefaultForm
                onSubmit={ send.exec }
                useAjvAsync={ true }
                initialValues={ recordState || defaultValues }
            >
                {(formikProps) => {
                    return (
                        <>
                            <Fields.SaneString
                                label='Name'
                                dataXPath='$.name'
                            />
                            <Button type='submit'>
                                Speichern
                            </Button>
                        </>
                    );
                }}
            </DefaultForm>
        </div>
    )
};
