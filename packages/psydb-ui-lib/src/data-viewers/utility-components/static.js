import React from 'react';

export const SaneString = (ps) => {
    var { value } = ps;
    return (
        <span>{ String(value) }</span>
    );
}

export const FullText = (ps) => {
    var { value } = ps;
    return (
        <div className='bg-white px-3 py-2 border'>
            { String(value).split(/\n/).map(it => (
                <span>{ it }<br /></span>
            )) }
        </div>
    );
}

export const HelperSetItemIdList = (ps) => {
    var { value, props } = ps;
    var { setId } = props;
    
    return (
        !(Array.isArray(value) && value.length)
        ? <i className='text-muted'>Keine</i>
        : <span>{ value.map(it => it).join(', ') }</span>
    )
}

export const ForeignIdList = (ps) => {
    var { value, props, related } = ps;
    var { collection } = props;
    
    return (
        <span>{ value.map(it => related.relatedRecordLabels[collection][it]._recordLabel).join(', ') }</span>
    )
}
