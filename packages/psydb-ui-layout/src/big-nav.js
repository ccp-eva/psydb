import React from 'react';
// FIXME: not sure f we want rozuter dom here
// maybe its pulled with react.router-bootstrap anyway
import { useRouteMatch } from 'react-router-dom';
import { BigNavItem } from './big-nav-item';

const strip = (str) => {
    return str.replace(/^\//, '');
}

const BigNav = ({ items }) => {
    var { url } = useRouteMatch();

    return (
        <nav>
            { items.map(({ linkUrl, linkTo, label }) => (
                <BigNavItem
                    key={ linkUrl || linkTo }
                    to={ linkUrl || `${url}/${strip(linkTo)}`}
                >
                    { label }
                </BigNavItem>
            ))}
        </nav>
    )
}

export default BigNav;
