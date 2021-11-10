import React from 'react';
import classnames from 'classnames';
// FIXME: not sure f we want rozuter dom here
// maybe its pulled with react.router-bootstrap anyway
import { LinkContainer } from 'react-router-bootstrap';

import * as Icons from './icons';

const AComponent = (ps) => {
    var { onClick, children, ...other } = ps;

    var className = classnames([
        'd-flex justify-content-between align-items-center',
        'bg-light p-3 border mt-2 mb-2'
    ]);

    return (
        <a 
            className='link'
            style={{ color: '#212529' }}
            onClick={ onClick } { ...other }
        >
            <h2
                className={ className }
                role='button'
            >
                <div>
                    { children }
                </div>
                <Icons.ChevronDoubleRight />
            </h2>
        </a>
    )
}

export const BigNavItem = (ps) => {
    var {
        to,
        onClick,
        children
    } = ps;

    if (to) {
        return (
            <LinkContainer
                to={ to }
                style={{ color: '#212529' }}
                className='big-nav'
            >
                <AComponent>{ children }</AComponent>
            </LinkContainer>
        )
    }
    else {
        return (
            <AComponent onClick={ onClick }>
                { children }
            </AComponent>
        )
    }
}
