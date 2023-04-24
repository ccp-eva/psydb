import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    ForeignId,
} from '../utility-components';


const labels = {
    '/personnelId': 'Account',
    '/apiKey': 'Api-Key',
    '/state/label': 'Bezeichnung'
}

const [ ApiKey, Context ] = createBase();
addComponents(ApiKey, Context, labels, [
    { 
        cname:'PersonnelId',
        path: '/personnelId',
        Component: withPair((ps) => (
            <ForeignId
                { ...ps }
                props={{ collection: 'personnel' }}
            />
        ))
    },
    {
        cname:'ApiKey',
        path: '/apiKey'
    },
    {
        cname:'Label',
        path: '/state/label'
    },
]);

export default ApiKey;
