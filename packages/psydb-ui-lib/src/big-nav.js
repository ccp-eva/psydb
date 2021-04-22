import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const strip = (str) => {
    return str.replace(/^\//, '');
}

const BigNav = ({ items }) => {
    var { url } = useRouteMatch();

    return (
        <nav>
            { items.map(({ linkUrl, linkTo, label }) => (
                <h2
                    key={ linkUrl || linkTo }
                    style={{ border: '1px solid lightgrey'}}
                >
                    <LinkContainer to={ linkUrl || `${url}/${strip(linkTo)}`}>
                        <a>{ label } {'->'}</a>
                    </LinkContainer>
                </h2>
            ))}
        </nav>
    )
}

export default BigNav;
