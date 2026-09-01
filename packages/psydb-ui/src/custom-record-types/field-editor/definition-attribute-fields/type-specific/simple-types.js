import React from 'react';
import * as Options from '../common-options';

const NoTypeOptions = (ps) => null;
const NoTypeOptionsList = (ps) => {
    return (
        <Options.MinItemsProp { ...ps } />
    )
}

const OnlyNullableOption = (ps) => {
    return (
        <Options.IsNullableProp { ...ps } />
    )
}

export const DefaultBool = NoTypeOptions;
export const ExtBool = NoTypeOptions;
export const GeoCoords = NoTypeOptions;

export const Email = OnlyNullableOption;
export const EmailList = NoTypeOptionsList;

export const Phone = OnlyNullableOption;
export const PhoneList = NoTypeOptionsList
export const PhoneWithTypeList = NoTypeOptionsList;


