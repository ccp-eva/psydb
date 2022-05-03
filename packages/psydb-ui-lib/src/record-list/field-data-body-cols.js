import React, { useState, useEffect } from 'react';
import applyValueToDisplayFields from '../apply-value-to-display-fields';

const FieldDataBodyCols = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
    wrapAsLinkTo,
}) => {

    var withValue = applyValueToDisplayFields({
        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        displayFieldData,
    });

    return (
        withValue.map(it => (
            wrapAsLinkTo
            ? (
                <td key={ it.key } className='p-0'>
                    <a
                        href={wrapAsLinkTo}
                        className='d-block text-reset'
                        style={{
                            textDecoration: 'none',
                            padding: '0.75rem'
                        }}
                    >
                            { it.value }
                    </a>
                </td>
            )
            : <td key={ it.key }>{ it.value }</td>
        ))
    );
}

export default FieldDataBodyCols;
