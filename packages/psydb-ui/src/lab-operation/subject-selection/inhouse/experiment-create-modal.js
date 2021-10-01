import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSend } from '@mpieva/psydb-ui-hooks';

import ExperimentShortControls from '@mpieva/psydb-ui-lib/src/experiment-short-controls';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';

import {
    Duration,
    FormattedDuration
} from '@mpieva/psydb-common-lib/src/durations';

import {
    ConstWidget,
    TimeSlotWidget,
    ExperimentOperatorTeamIdWidget,
} from '@mpieva/psydb-ui-lib/src/rjsf-components';

const extractTime = (dateIsoString) => (
    NaN !== (new Date(dateIsoString)).getTime()
    ? datefns.format(new Date(dateIsoString), 'HH:mm:ss.SSS') + 'Z'
    : dateIsoString
);

var createSchema = ({
    subjectLabel,

    start,
    slotDuration,
    maxEnd
}) => ({
    type: 'object',
    properties: {
        subject: {
            title: 'Proband',
            type: 'string',
            const: subjectLabel,
            default: subjectLabel,
        },
        date: {
            title: 'Datum',
            type: 'string',
            const: datefns.format(start, 'PPPP'),
            default: datefns.format(start, 'PPPP')
        },
        start: {
            title: 'Von',
            type: 'string',
            const: extractTime(start).slice(0,5),
            default: extractTime(start).slice(0,5)
        },
        end: {
            title: 'Bis',
            type: 'string',
            format: 'time',
            default: extractTime(
                new Date(start.getTime() + (slotDuration || 0))
            ),
            formatMinimum: extractTime(
                new Date(start.getTime() + (slotDuration || 0))
            ),
            formatMaximum: extractTime(maxEnd),
            formatStep: FormattedDuration(slotDuration) + 'Z',
        },
    },
    required: [
        'end',
    ]
})

var uiSchema = {
    'subject': {
        'ui:widget': ConstWidget,
    },
    'date': {
        'ui:widget': ConstWidget,
    },
    'start': {
        'ui:widget': ConstWidget,
    },
    'end': {
        'ui:widget': TimeSlotWidget
    },
}

var SchemaForm = withTheme(Bootstrap4Theme);

const CreateModal = ({
    show,
    onHide,
    subjectId,
    subjectLabel,

    studyId,
    locationRecord,
    reservationRecord,
    teamRecords,
    start,
    slotDuration,
    maxEnd,

    onSuccessfulCreate,
}) => {
    if (!show) {
        return null;
    }

    var locationId = locationRecord._id;
    var experimentOperatorTeamId = (
        reservationRecord.state.experimentOperatorTeamId
    );
    //var fallbackDate = new Date(0);
    
    /*start = start || fallbackDate;
    maxEnd = maxEnd || fallbackDate;
    console.log(slotDuration);
    slotDuration = slotDuration || Duration('0:30')*/

    var schema = createSchema({
        subjectLabel,

        start,
        slotDuration,
        maxEnd,
    });

    var startOfDay = datefns.startOfDay(start).getTime();

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var minEnd = new Date(start.getTime() + slotDuration);
    var [ end, setEnd ] = useState(minEnd);

    var handleSubmit = ({ formData }) => {
        //var { end, comment, autoConfirmInvitation } = formData;

        var message = {
            type: 'experiment/create-from-inhouse-reservation',
            payload: {
                props: {
                    studyId,
                    experimentOperatorTeamId,
                    locationId,
                    //subjectIds: [ subjectId ],
                    subjectData: [{ subjectId, comment, autoConfirm }],

                    interval: {
                        start: start.toISOString(),
                        end: new Date(end.getTime() - 1).toISOString()
                    }
                }
            }
        }
        return agent.send({ message }).then((response) => {
            onHide();
            onSuccessfulCreate && onSuccessfulCreate(response);
        });
    }

    return (
        <Modal show={show} onHide={ onHide } size='md'>
            <Modal.Header closeButton>
                <Modal.Title>Termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ExperimentShortControls { ...({
                    subjectLabel,

                    start,
                    end,
                    minEnd,
                    maxEnd,
                    slotDuration,

                    comment,
                    autoConfirm,

                    onChangeComment: setComment,
                    onChangeAutoConfirm: setAutoConfirm,
                    onChangeEnd: setEnd,
                })} />
                
                <hr />
                <div className='d-flex justify-content-end'>
                    <Button size='sm' onClick={ handleSubmit }>
                        Speichern
                    </Button>
                </div>
                {/*<SchemaForm
                    schema={ schema }
                    uiSchema={ uiSchema }
                    onSubmit={ handleSubmit }
                />*/}
            </Modal.Body>
        </Modal>
    );
}

export default CreateModal;
