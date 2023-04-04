import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { GenericTypeKey } from './generic-type-key';

export const LocationTypeKey = withField({ Control: (ps) => (
    <GenericTypeKey.Control { ...ps } collection='location' />
)});
