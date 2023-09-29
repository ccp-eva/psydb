import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    DefaultBool,
} from '../utility-components';

const labels = {
    '/state/label': 'Display Name',
    '/state/requiresTestingPermissions': 'Requires Participation Permissions',
    '/state/commentFieldIsSensitive': 'Comment Field Requires Extra Permission',
    '/state/showSequenceNumber': 'Show ID No.',
    '/state/showOnlineId': 'Show Online ID Code',

    '/state/reservationType': 'Reservation Type',

    '/state/enableLabTeams': 'Enable Lab Teams',
    '/state/enableSubjectSelectionSettings': 'Enable Subject Selection',
}

const [ CRT, CRTContext ] = createBase();
addComponents(CRT, CRTContext, labels, [
    {
        cname: 'Label',
        path: '/state/label',
        Component: withPair(SaneString)
    },
    {
        cname: 'RequiresTestingPermissions',
        path: '/state/requiresTestingPermissions',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'CommentFieldIsSensitive',
        path: '/state/commentFieldIsSensitive',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'ShowSequenceNumber',
        path: '/state/showSequenceNumber',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'ShowOnlineId',
        path: '/state/showOnlineId',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'EnableLabTeams',
        path: '/state/enableLabTeams',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'EnableSubjectSelectionSettings',
        path: '/state/enableSubjectSelectionSettings',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'ReservationType',
        path: '/state/reservationType',
        Component: withPair((ps) => {
            var { value } = ps;
            var translate = useUITranslation();

            return translate(`_reservationType_${value}`);
        })
    },
]);

export default CRT;
