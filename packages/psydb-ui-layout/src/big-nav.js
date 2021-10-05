import React from 'react';
// FIXME: not sure f we want rozuter dom here
// maybe its pulled with react.router-bootstrap anyway
import { useRouteMatch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import {
    ChevronDoubleRight
} from 'react-bootstrap-icons';

const strip = (str) => {
    return str.replace(/^\//, '');
}

const BigNav = ({ items }) => {
    var { url } = useRouteMatch();

    return (
        <nav>
            { items.map(({ linkUrl, linkTo, label }) => (
                <LinkContainer
                    key={ linkUrl || linkTo }
                    to={ linkUrl || `${url}/${strip(linkTo)}`}
                    style={{ color: '#212529' }}
                    className='big-nav'
                >
                    <a>
                        <h2
                            className='bg-light p-3 border mt-2 mb-2 d-flex justify-content-between align-items-center'
                            role='button'
                        >
                            <span>{ label }</span>
                            <ChevronDoubleRight />
                        </h2>
                    </a>
                </LinkContainer>
            ))}
        </nav>
    )
}

export default BigNav;
