import React, { useState, useEffect, useReducer } from 'react';
import { FormattedDuration } from '@mpieva/psydb-common-lib/src/durations';
import datefns from '../../date-fns';
import * as wrappers from './wrapper-components';

const { InlineWrapper, OneLineWrapper } = wrappers;

const styles = {
    bold: { fontWeight: '600' }
}

export const Plain = ({
    properties,
    schema,
    title,
    ...other
}) => {
    var {
        systemType,
        systemProps = {}
    } = schema;
    
    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.PlainWrapper;
    }
    //console.log(other);
    return (
        <Wrapper label={ title } { ...systemProps }>
            { properties.map((element, index) => {
                return <div key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            }) }
        </Wrapper>
    )
}

export const Address = ({
    title,
    formData
}) => {
    return (
        <InlineWrapper label={ title }>
            <div style={ styles.bold }>
                { formData.street }
                {' '}
                { formData.housenumber }
                {' '}
                { formData.affix }
            </div>
            <div style={ styles.bold }>
                { formData.postcode }
                {' '}
                { formData.city }
                {' '}
                ({ formData.country})
            </div>
        </InlineWrapper>
    )
}

export const EmailListItem = ({
    title,
    formData,
}) => {
    return (
        <OneLineWrapper>
            <b style={ styles.bold }>
                { formData.email }
            </b>
            {' '}
            { formData.isPrimary && (
                <b style={ styles.bold } className='text-primary'>
                    (primär)
                </b>
            )}
        </OneLineWrapper>
    )
}

export const PhoneListItem = ({
    title,
    schema,
    formData,
}) => {

    var typeIndex = schema.properties.type.enum.findIndex(it => (
        it === formData.type
    ));
    var typeDisplayName = schema.properties.type.enumNames[typeIndex]

    return (
        <OneLineWrapper>
            <b style={ styles.bold }>
                { formData.number }
                {' '}
                ({ typeDisplayName })
            </b>
        </OneLineWrapper>
    )
}

export const DateTimeInterval = ({
    title,
    schema,
    formData,
}) => {
    var formattedStart = (
        formData.start === undefined
        ? undefined
        : datefns.format(new Date(formData.start), 'P p')
    );
    var formattedEnd = (
        formData.end === undefined
        ? undefined
        : datefns.format(new Date(formData.end), 'P p')
    );
    return (
        <InlineWrapper label={ title }>
            <b style={ styles.bold }>
                { formattedStart } - { formattedEnd }
            </b>
        </InlineWrapper>
    )
}

export const BlockedFromTesting = ({
    title,
    schema,
    formData,
}) => {
    var start = new Date(formData.start);
    var end = new Date(formData.end);
    var now = new Date();


    var text;
    if (end < now) {
        text = 'Nein'
    }
    else {
        var formattedStart = datefns.format(start, 'P p');
        var formattedEnd = datefns.format(end, 'P p');
        text = `${formattedStart} - ${formattedEnd}`
    }
    return (
        <InlineWrapper label={ title }>
            <b style={ styles.bold }>
                { text }
            </b>
        </InlineWrapper>
    )
}

export const TimeInterval = ({
    title,
    schema,
    formData,
}) => {
    var resolution = 'MINUTE';
    return (
        <InlineWrapper label={ title }>
            <b style={ styles.bold }>
                { FormattedDuration(formData.start, { resolution })}
                {' - '}
                { FormattedDuration(formData.end, { resolution })}
            </b>
        </InlineWrapper>
    )
}

export const WeekdayBoolObject = ({
    title,
    schema,
    formData
}) => {
    var wd = {
        'mon': 'Montag',
        'tue': 'Dienstag',
        'wed': 'Mittwoch',
        'thu': 'Donnerstag',
        'fri': 'Freitag',
        'sat': 'Samstag',
        'sun': 'Sonntag',
    }
    return (
        <InlineWrapper label={ title }>
            <b style={ styles.bold }>
                { 
                    Object.keys(wd)
                        .filter(key => formData[key] === true)
                        .map(key => wd[key])
                        .join(', ')
                }
            </b>
        </InlineWrapper>
    );
}
