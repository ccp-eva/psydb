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
            { items.map(it => (
                <h2
                    key={ it.linkTo }
                    style={{ border: '1px solid lightgrey'}}
                >
                    <LinkContainer to={`${url}/${strip(it.linkTo)}`}>
                        <a>{ it.label } {'->'}</a>
                    </LinkContainer>
                </h2>
            ))}
        </nav>
    )
}

export default BigNav;
