import React, { useState, useEffect } from 'react';

import {
    Button,
    Modal
} from 'react-bootstrap';

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
    start,
    slotDuration,
    maxEnd
}) => ({
    type: 'object',
    properties: {
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
        experimentOperatorTeamId: {
            title: 'Team',
            type: 'string',
            systemType: 'ForeignId',
            systemProps: {
                collection: 'experimentOperatorTeam',
            },
        }
    },
    required: [
        'end',
        'experimentOperatorTeamId',
    ]
})

var uiSchema = {
    'date': {
        'ui:widget': ConstWidget,
    },
    'start': {
        'ui:widget': ConstWidget,
    },
    'end': {
        'ui:widget': TimeSlotWidget
    },
    'experimentOperatorTeamId': {
        'ui:widget': ExperimentOperatorTeamIdWidget,
    }
}

var SchemaForm = withTheme(Bootstrap4Theme);

const CreateModal = ({
    show,
    onHide,
    studyId,
    locationRecord,
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
    //var fallbackDate = new Date(0);
    
    /*start = start || fallbackDate;
    maxEnd = maxEnd || fallbackDate;
    console.log(slotDuration);
    slotDuration = slotDuration || Duration('0:30')*/

    var schema = createSchema({
        start,
        slotDuration,
        maxEnd,
    });

    var startOfDay = datefns.startOfDay(start).getTime();

    var handleSubmit = ({ formData }) => {
        var { end, experimentOperatorTeamId } = formData;
        var message = {
            type: 'reservation/reserve-inhouse-slot',
            payload: {
                props: {
                    studyId,
                    experimentOperatorTeamId,
                    locationId,
                    interval: {
                        start: start.toISOString(),
                        end: (
                            new Date(startOfDay + Duration(end) - 1)
                            .toISOString()
                        ),
                    }
                }
            }
        }
        agent.send({ message }).then((response) => {
            onSuccessfulCreate && onSuccessfulCreate(response);
            onHide();
        });
    }

    return (
        <Modal show={show} onHide={ onHide } size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Reservierung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SchemaForm
                    schema={ schema }
                    uiSchema={ uiSchema }
                    onSubmit={ handleSubmit }
                    formContext={{
                        relatedRecords: {
                            experimentOperatorTeam: teamRecords
                        }
                    }}
                />
            </Modal.Body>
        </Modal>
    );
}

export default CreateModal;
