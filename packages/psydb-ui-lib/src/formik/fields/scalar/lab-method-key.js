import React from 'react';
import { labMethods } from '@mpieva/psydb-schema-enums';
import { GenericEnum } from './generic-enum';

export const LabMethodKey = (ps) => (
    <GenericEnum options={ labMethods.mapping } { ...ps } />
)
