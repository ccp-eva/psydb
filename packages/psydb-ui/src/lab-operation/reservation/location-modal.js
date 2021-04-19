import React, { useState, useEffect } from 'react';

import {
    Button,
    Modal
} from 'react-bootstrap';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import { TimeSlotWidget } from '@mpieva/psydb-ui-lib/src/rjsf-components';

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
            type: 'string',
            format: 'time',
            formatMinimum: extractTime(start),
            formatMaximum: extractTime(maxEnd),
            formatTimeStep: slotDuration,
        }
    },
    required: [
        'end',
    ]
})

var uiSchema = {
    'start': {
        'ui:widget': TimeSlotWidget
    }
}

var SchemaForm = withTheme(Bootstrap4Theme);

const LocationModal = ({
    show,
    onHide,
    studyId,
    locationId,
    start,
    slotDuration,
    maxEnd,
}) => {
    var fallbackDate = new Date(0);
    
    start = start || fallbackDate;
    maxEnd = maxEnd || fallbackDate;

    var schema = createSchema({
        start,
        slotDuration,
        maxEnd,
    });
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Reservierung</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SchemaForm
                    schema={ schema }
                    uiSchema={ uiSchema }
                    onSubmit={ () => {} }
                />
            </Modal.Body>
        </Modal>
    );
}

export default LocationModal;
