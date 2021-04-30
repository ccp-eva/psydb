import React from 'react';
import { InlineWrapper } from './wrapper-components';
import datefns from '../date-fns';

const styles = {
    bold: { fontWeight: '500' }
}

export const PlainText = ({ label, value }) => (
    <InlineWrapper label={ label }>
        <b style={ styles.bold }>{ value }</b>
    </InlineWrapper>
)

export const ForeignId = ({
    label,
    value: recordId,
    schema,
    formContext,
}) => {
    if (!recordId) {
        <InlineWrapper label={ label }>
            <i className='text-muted'>
                Nicht gewählt
            </i>
        </InlineWrapper>
    }
    
    var { systemProps } = schema;
    var { collection, recordType, constraints } = systemProps;

    var { relatedRecordLabels } = formContext;
    var record;
    if (relatedRecordLabels) {
        record = relatedRecordLabels[collection][recordId]
    }

    if (recordId && !record) {
        // create erroneous record
        record = { _id: recordId };
    }

    return (
        record._recordLabel
        ? (
            <InlineWrapper label={ label }>
                <b style={ styles.bold }>{ record._recordLabel }</b>
            </InlineWrapper>
        )
        : (
            <InlineWrapper label={ label }>
                <b className='text-danger' style={ styles.bold }>
                    { recordId }
                </b>
            </InlineWrapper>
        )
    )
}

export const HelperSetItemId = ({
    label,
    value: itemKey,
    schema,
    formContext,
}) => {
    if (!itemKey) {
        <InlineWrapper label={ label }>
            <i className='text-muted'>
                Nicht gewählt
            </i>
        </InlineWrapper>
    }

    var { systemProps } = schema;
    var { set } = systemProps;

    var { relatedHelperSetItems } = formContext;
   
    var item;
    if (relatedHelperSetItems) {
        item = relatedHelperSetItems[set][itemKey]
    }

    return (
        <InlineWrapper label={ label }>
            {
                item
                ? (
                    <b style={ styles.bold }>{ item.state.label }</b>
                )
                : (
                    <b style={ styles.bold } className='text-danger'>
                        { itemKey }
                    </b>
                )
            }
        </InlineWrapper>
    )
}

export const DateTime = ({ label, value, schema }) => {
    return (
        <InlineWrapper label={ label }>
            <b style={ styles.bold }>{
                datefns.format(new Date(value), 'P p')
            }</b>
        </InlineWrapper>
    );
}
