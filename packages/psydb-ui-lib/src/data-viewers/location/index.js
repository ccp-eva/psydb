import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    FullText,
    SystemPermissions,
} from '../utility-components';

import ReservationSettings from './reservation-settings';

const labels = {
    '/sequenceNumber': 'ID No.',
    '/state/comment': 'Comment',
}

const [ Location, LocationContext ] = createBase();
addComponents(Location, LocationContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'SystemPermissions',
        path: '/state/systemPermissions',
        Component: SystemPermissions
    },
    {
        cname: 'ReservationSettings',
        path: '/state/reservationSettings',
        Component: ReservationSettings
    },

    { cname: 'Custom', path: '/state/custom', Component: Custom },
    {
        cname: 'Comment',
        path: '/state/comment',
        Component: withPair(FullText)
    },
]);

export default Location;
