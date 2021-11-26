import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';

import {
    ExactObject,
    DateTime,
    ForeignId,
    ParticipationStatus,
} from '@mpieva/psydb-schema-fields';

import { SchemaForm } from '@mpieva/psydb-ui-lib';

var createFormSchema = ({
    subjectRecordType,
}) => (
    ExactObject({
        properties: {
            timestamp: DateTime({
                title: 'Test-Zeitpunkt',
            }),
            studyId: ForeignId({
                title: 'Studie',
                collection: 'study',
                recordType: 'default' // FIXME
            }),
            status: ParticipationStatus({
                title: 'Status',
                default: undefined
            })
        },
        required: [
            'timestamp',
            'studyId',
            'status',
        ]
    })
);

const ParticipationForm = ({
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

export default ParticipationForm;
