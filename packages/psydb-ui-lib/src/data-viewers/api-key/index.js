import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    ForeignId,
    DefaultBool,
} from '../utility-components';


const labels = {
    '/personnelId': 'Account',
    '/apiKey': 'API Key',
    '/state/label': 'Label',
    '/state/isEnabled': 'Enabled'
}

const [ ApiKey, Context ] = createBase();
addComponents(ApiKey, Context, labels, [
    { 
        cname: 'PersonnelId',
        path: '/personnelId',
        Component: withPair((ps) => (
            <ForeignId
                { ...ps }
                props={{ collection: 'personnel' }}
            />
        ))
    },
    {
        cname: 'ApiKey',
        path: '/apiKey'
    },
    {
        cname: 'Label',
        path: '/state/label'
    },
    {
        cname:'IsEnabled',
        path: '/state/isEnabled',
        Component: withPair(DefaultBool)
    },
]);

export default ApiKey;
