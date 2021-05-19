import React, { useState, useEffect, useReducer } from 'react';
import { FormattedDuration } from '@mpieva/psydb-common-lib/src/durations';
import datefns from '../date-fns';
import { InlineWrapper, OneLineWrapper } from './wrapper-components';

const styles = {
    bold: { fontWeight: '500' }
}

export const Plain = ({
    properties,
    schema,
    ...other
}) => {
    //console.log(other);
    return (
        <>
            { properties.map((element, index) => {
                return <div key={index}>
                    { /*schema.systemType || 'undefined' */}
                    { element.content }
                </div>
            }) }
        </>
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
    var formattedStart = datefns.format(new Date(formData.start), 'P p');
    var formattedEnd = datefns.format(new Date(formData.end), 'P p');
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
