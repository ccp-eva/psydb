import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import * as CoreFields from '../fields';

export const Address = withField({ Control: (ps) => {
    return (
        <CoreFields.Address.Control { ...ps } />
    );
}});
