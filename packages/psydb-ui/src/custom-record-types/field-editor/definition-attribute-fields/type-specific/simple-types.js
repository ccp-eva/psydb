import React from 'react';
import * as Options from '../common-options';

const NoTypeOptions = (ps) => null;
const NoTypeOptionsList = (ps) => {
    return (
        <Options.MinItemsProp { ...ps } />
    )
}

const OnlyMinLengthOption = (ps) => {
    return (
        <Options.MinLengthProp { ...ps } />
    )
}

export const DefaultBool = NoTypeOptions;
export const ExtBool = NoTypeOptions;
export const GeoCoords = NoTypeOptions;

export const Email = OnlyMinLengthOption;
export const EmailList = NoTypeOptionsList;

export const Phone = OnlyMinLengthOption;
export const PhoneList = NoTypeOptionsList
export const PhoneWithTypeList = NoTypeOptionsList;


