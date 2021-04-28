import React from 'react';
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
                <LinkContainer to={ linkUrl || `${url}/${strip(linkTo)}`}>
                    <h2
                        className='bg-light p-3 border mt-2 mb-2 d-flex justify-content-between align-items-center'
                        key={ linkUrl || linkTo }
                        role='button'
                    >
                        <span>{ label }</span>
                        <ChevronDoubleRight />
                    </h2>
                </LinkContainer>
            ))}
        </nav>
    )
}

export default BigNav;
