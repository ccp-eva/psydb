import React from 'react';
import { FormattedDuration } from '@mpieva/psydb-common-lib/src/durations';
import { LinkContainer } from '@mpieva/psydb-ui-layout';
import { InlineWrapper } from './wrapper-components';
import datefns from '../../date-fns';

const styles = {
    bold: { fontWeight: '600' }
}

export const PlainText = ({ label, value }) => (
    <InlineWrapper label={ label }>
        <b style={ styles.bold }>{ value }</b>
    </InlineWrapper>
)

export const FullText = ({ label, value }) => (
    <InlineWrapper label={ label }>
        <b style={ styles.bold }>{ (value || '').split("\n").map(it => (
            <>{ it }<br /></>
        )) }</b>
    </InlineWrapper>
)

var collectionMapping = {
    'subject': 'subjects',
    'researchGroup': 'research-groups',
    'location': 'locations',
    'study': 'studies',
    'personnel': 'personnel',
    'externalPerson': 'external-persons',
    'externalOrganization': 'external-organizations',
    'systemRole': 'system-roles',
}

export const ForeignId = ({
    label,
    value: recordId,
    schema,
    formContext,

    isArrayItem,
    index,
    maxIndex,
}) => {
    var renderedValue = undefined;
    if (recordId) {
        var { systemProps } = schema;
        var { collection, recordType, constraints } = systemProps;

        var { relatedRecordLabels } = formContext;
        var record;
        if (relatedRecordLabels) {
            record = relatedRecordLabels[collection][recordId]
        }

        var renderedText = (
            <b style={ styles.bold } className={ record ? '' : 'text-danger'}>
                { record ? record._recordLabel : recordId }
            </b>
        );

        var collectionUI = collectionMapping[collection];

        var uri = (
            recordType
            ? `/${collectionUI}/${recordType}/${recordId}`
            : `/${collectionUI}/${recordId}`
        );

        renderedValue = (
            collectionUI
            ? (
                <LinkContainer to={ uri }>
                    <a>{ renderedText }</a>
                </LinkContainer>
            )
            : renderedText
        );
    }
    else {
        renderedValue = (
            <i className='text-muted'>
                Nicht gewählt
            </i>
        )
    }

    if (isArrayItem) {
        return (
            <span>
                { renderedValue }
                { index < maxIndex ? ', ' : ''}
            </span>
        );
    }
    else {
        return (
            <InlineWrapper label={ label }>
                { renderedValue }
            </InlineWrapper>
        )
    }

}

export const HelperSetItemId = ({
    label,
    value: itemKey,
    schema,
    formContext,
    isArrayItem,
    index,
    maxIndex,
    ...other
}) => {
    var renderedTextValue = undefined;
    if (itemKey) {
        var { systemProps } = schema;
        var { setId } = systemProps;

        var { relatedHelperSetItems } = formContext;

        var item;
        if (relatedHelperSetItems) {
            item = relatedHelperSetItems[setId][itemKey]
        }

        renderedTextValue = (
            <b style={ styles.bold } className={ item ? '' : 'text-danger'}>
                { item ? item.state.label : itemKey }
            </b>
        )
    }
    else {
        renderedTextValue = (
            <i className='text-muted'>
                Nicht gewählt
            </i>
        )
    }

    if (isArrayItem) {
        return (
            <span>
                { renderedTextValue }
                { index < maxIndex ? ', ' : ''}
            </span>
        );
    }
    else {
        return (
            <InlineWrapper label={ label }>
                { renderedTextValue }
            </InlineWrapper>
        )
    }

}

export const CustomRecordTypeKey = ({
    label,
    value: typeKey,
    schema,
    formContext,
    isArrayItem,
    index,
    maxIndex,
    ...other
}) => {
    var renderedTextValue = undefined;
    if (typeKey) {
        var { systemProps } = schema;
        var { collection } = systemProps;

        var { relatedCustomRecordTypeLabels } = formContext;

        var recordType;
        if (relatedCustomRecordTypeLabels) {
            recordType = relatedCustomRecordTypeLabels[collection][typeKey]
        }

        renderedTextValue = (
            <b style={ styles.bold } className={ recordType ? '' : 'text-danger'}>
                { recordType ? recordType.state.label : typeKey }
            </b>
        )
    }
    else {
        renderedTextValue = (
            <i className='text-muted'>
                Nicht gewählt
            </i>
        )
    }

    if (isArrayItem) {
        return (
            <span>
                { renderedTextValue }
                { index < maxIndex ? ', ' : ''}
            </span>
        );
    }
    else {
        return (
            <InlineWrapper label={ label }>
                { renderedTextValue }
            </InlineWrapper>
        )
    }

}

export const DateTime = ({ label, value, schema }) => {
    return (
        <InlineWrapper label={ label }>
            <b style={ styles.bold }>{
                value === undefined
                ? '-' 
                : datefns.format(new Date(value), 'P p')
            }</b>
        </InlineWrapper>
    );
}

export const DateOnlyServerSide = ({ label, value, schema }) => {
    return (
        <InlineWrapper label={ label }>
            <b style={ styles.bold }>{
                value === undefined || value === null
                ? '-' 
                : datefns.format(new Date(value), 'P')
            }</b>
        </InlineWrapper>
    );
}

export const Time = ({ label, value, schema }) => {
    return (
        <InlineWrapper label={ label }>
            <b style={ styles.bold }>
                { FormattedDuration(value, { resolution: 'MINUTE' }) }
            </b>
        </InlineWrapper>
    );
}
