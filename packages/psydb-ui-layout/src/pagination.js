import React from 'react';
import classnames from 'classnames';
import { Form } from 'react-bootstrap';

import PaddedText from './padded-text';

const Pagination = ({
    extraClassName,
    totalLabel,

    offset,
    limit,
    total,
    
    page,
    maxPage,

    setOffset,
    setLimit,
    selectNextPage,
    selectPrevPage,
    selectSpecificPage,

    showTotal = true,
    showLimit = true,
    showPages = true,
}) => {
    var className = classnames([
        'bg-light pt-2 pb-2 pr-3 pl-3',
        'd-flex align-items-center',
        extraClassName,
    ]);
    return (
        <div className={ className }>
            { showTotal && (
                <span style={{ width: '150px' }}>
                    <b>{ totalLabel || 'Gesamt:' }</b> { total }
                </span>
            )}

            { showLimit && (
                <>
                    <b className='mr-3'>pro Seite:</b>
                    <LimitControl
                        value={ limit }
                        onChange={ setLimit }
                    />
                </>
            )}

            { showPages && (
                <div className='ml-auto'>
                    <PageNav { ...({
                        page,
                        maxPage,
                        selectNextPage,
                        selectPrevPage,
                        selectSpecificPage
                    }) }/>
                </div>
            )}
        </div>
    )
}


const LimitControl = ({
    value,
    onChange,
}) => {
    var steps = [ 25, 50, 100, 250, 500, 1000 ];
    return (
        <div className='user-select-none'>
            { steps.map((s, index) => {
                var props = {
                    key: index,
                    role: 'button',
                    className: 'd-inline-block mr-2 text-primary',
                    onClick: () => onChange(s)
                }
                return (
                    s === value
                    ? <u { ...props }><b>{ s }</b></u>
                    : <span { ...props}>{ s }</span>
                )
            }) }
        </div>
    )
}

const range = (n) => [ ...Array(n).keys() ];

const PageNav = ({
    page,
    maxPage,
    selectNextPage,
    selectPrevPage,
    selectSpecificPage,
}) => {
    var start = page - 1;
    var end = page + 2;

    if (start < 0) {
        start = 0;
    }
    if (end > maxPage) {
        end = maxPage;
    }

    var items = [];
    for (var i = start; i < end; i += 1) {
        items.push(i);
    }

    if (!items.length) {
        items = [0];
        page = 0;
        maxPage = 1;
        //return null;
    }

    return (
        <div className='user-select-none'>
            <b className='d-inline-block mr-3'>Seite:</b>
            { page > 0 && (
                <span
                    role='button'
                    className='d-inline-block text-primary mr-2'
                    onClick={ selectPrevPage }
                >
                    {'<'}
                </span>
            )}
            { items.map((it, index) => {
                var props = {
                    key: index,
                    role: 'button',
                    className: 'd-inline-block mr-2 text-primary',
                    onClick: () => selectSpecificPage(it)
                }
                return (
                    it === page
                    ? <u { ...props }><b>{ it + 1 }</b></u>
                    : <span { ...props}>{ it + 1 }</span>
                )
            }) }
            { page < (maxPage - 1)  && (
                <span
                    role='button'
                    className='d-inline-block text-primary mr-2'
                    onClick={ selectNextPage }
                >
                    {'>'}
                </span>
            )}
            <span>
                von { maxPage }
            </span>
        </div>
    )
}

export default Pagination;
