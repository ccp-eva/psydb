import React from 'react';
import { Custom } from './custom';

export const CustomGDPR = (ps) => (
    <Custom { ...ps } subChannelKey='gdpr' />
);
