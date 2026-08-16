import React from 'react';
import * as Options from '../common-options';

const NoTypeOptions = (ps) => null;
const NoTypeOptionsList = (ps) => {
    return (
        <Options.MinItemsProp { ...ps } />
    )
}

export const DefaultBool = NoTypeOptions;
export const ExtBool = NoTypeOptions;
export const GeoCoords = NoTypeOptions;

export const Email = NoTypeOptions;
export const EmailList = NoTypeOptionsList;

export const Phone = NoTypeOptions;
export const PhoneList = NoTypeOptionsList
export const PhoneWithTypeList = NoTypeOptionsList;


