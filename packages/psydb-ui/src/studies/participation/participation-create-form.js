import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';

import {
    ExactObject,
    DateTime,
    ForeignId,
    ParticipationStatus,
} from '@mpieva/psydb-schema-fields';

import agent from '@mpieva/psydb-ui-request-agents';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

var createFormSchema = ({
    subjectRecordType,
}) => (
    ExactObject({
        properties: {
            timestamp: DateTime({
                title: 'Test-Zeitpunkt',
            }),
            id: ForeignId({
                title: 'Proband',
                collection: 'subject',
                recordType: subjectRecordType
            }),
            status: ParticipationStatus({
                title: 'Status',
                default: undefined
            })
        },
        required: [
            'timestamp',
            'id',
            'status',
        ]
    })
);

const ParticipationCreateForm = ({
    subjectRecordType,
    onSubmit,
}) => {
    var schema = useMemo(
        () => createFormSchema({
            subjectRecordType
        }), [ subjectRecordType ]
    );

    //console.log(schema);

    return (
        <SchemaForm
            schema={ schema }
            onSubmit={ onSubmit }
        >
        </SchemaForm>
    );
}

export default ParticipationCreateForm;
