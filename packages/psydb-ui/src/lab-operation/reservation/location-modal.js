import React, { useState, useEffect } from 'react';

import {
    Button,
    Modal
} from 'react-bootstrap';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

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
    ? datefns.format(new Date(dateIsoString), 'HH:mm')
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
            const: extractTime(start),
            default: extractTime(start)
        },
        end: {
            title: 'Bis',
            type: 'string',
            format: 'time',
            formatMinimum: extractTime(
                new Date(start.getTime() + (slotDuration || 0))
                //start
            ),
            formatMaximum: extractTime(maxEnd),
            formatStep: FormattedDuration(slotDuration),
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

const LocationModal = ({
    show,
    onHide,
    studyId,
    locationId,
    teamRecords,
    start,
    slotDuration,
    maxEnd,
}) => {
    var fallbackDate = new Date(0);
    
    start = start || fallbackDate;
    maxEnd = maxEnd || fallbackDate;
    console.log(slotDuration);
    slotDuration = slotDuration || Duration('0:30')

    var schema = createSchema({
        start,
        slotDuration,
        maxEnd,
    });
    return (
        <Modal show={show} onHide={ onHide } size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>Reservierung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SchemaForm
                    schema={ schema }
                    uiSchema={ uiSchema }
                    onSubmit={ () => {} }
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

export default LocationModal;
