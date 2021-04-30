import React from 'react';
import { InlineWrapper } from './wrapper-components';

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
        <i className='text-muted'>
            Nicht gewählt
        </i>
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
