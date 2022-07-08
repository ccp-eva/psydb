import React, { useState } from 'react';
import classnames from 'classnames';
import { Form, Button } from 'react-bootstrap';
import * as Icons from './icons';

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
        //'media-print-hidden',
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
    var steps = [ 2, 25, 50, 100, 250, 500, 1000 ];
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

    var [ jumpPage, setJumpPage ] = useState('');
    var handleJump = () => {
        var sane = Math.floor(jumpPage);
        if (sane < 1) {
            sane = 1;
        }
        else if (sane > maxPage) {
            sane = maxPage;
        }
        selectSpecificPage(sane - 1);
    }

    return (
        <div className='d-flex'>
            <div className='d-flex align-items-center'>
                <input
                    type='number'
                    placeholder='zu Seite'
                    min={ 1 } step={ 1 } max={ maxPage }
                    style={{
                        width: '150px',
                        fontSize: '75%',
                    }}
                    value={ jumpPage }
                    onChange={ (event) => setJumpPage(event.target.value)}
                    onKeyPress={ (event) => {
                        event.key === 'Enter' && handleJump()
                    }}
                />
                <Button size='sm' style={{
                    fontSize: '75%',
                    padding: '0'
                }} onClick={ handleJump }>
                    <Icons.ArrowRightShort
                        style={{
                            height: '22px',
                            width: '22px'
                        }}
                    />
                </Button>
            </div>
            <div className='user-select-none ml-3'>
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
        </div>
    )
}

export default Pagination;
