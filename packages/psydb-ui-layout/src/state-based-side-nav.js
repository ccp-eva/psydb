import React, { useState } from 'react';
import { entries } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import { Nav } from 'react-bootstrap';

export const StateBasedSideNav = (ps) => {
    var { hook, links, ...pass } = ps;
    return (
        <Container { ...pass }>
            <LinkList hook={ hook } links={ links } />
        </Container>
    )
}

const LinkList = (ps) => {
    var { hook, links } = ps;

    var out = [];
    for (var [ href, item ] of entries(links)) {
        out.push(
            <Link key={ href } href={ href } hook={ hook } { ...item } />
        )
    }

    return out;
}

const Link = (ps) => {
    var {
        href, label, hook,
        show = true, enabled = true
    } = ps;

    if (!show) {
        return null;
    }

    var [ current, setCurrent ] = hook;
    var onClick = () => setCurrent(href);

    var active = false;
    if (href === current) {
        active = true;
    }
    
    var style = styleInactive;
    if (!enabled) {
        style = styleDisabled;
    }
    if (enabled && active) {
        style = styleActive;
    }

    return (
        <a style={ style } onClick={ enabled ? onClick : undefined }>
            { label }
        </a>
    )
}

const Container = (ps) => {
    var { style, className, children } = ps;
    var [ isCollapsed, setIsCollapsed ] = useState(false);
    var toggle = () => setIsCollapsed(!isCollapsed);
    
    return (
        <nav
            style={{ minWidth: '200px', ...style }}
            className={ className }
        >
            { children }
        </nav>
    )
}

const HR = () => {
    return (
        <span style={ styleInactive }>
            <hr className='bs5 my-0' />
        </span>
    )
}

StateBasedSideNav.Container = Container;
StateBasedSideNav.LinkList = LinkList;
StateBasedSideNav.Link = Link;
StateBasedSideNav.HR = HR;

const styleBase = {
    display: 'block',
    borderRadius: 0,
    border: 0,
    backgroundColor: 'transparent',
    padding: '0.5rem 1rem',
}

const styleDisabled = {
    ...styleBase,
    color: '#ccc',
    borderRight: '3px solid #dee2e6',
    cursor: 'default'
}

const styleActive = {
    ...styleBase,
    color: 'var(--primary)',
    borderRight: '3px solid var(--primary)',
}

const styleInactive = {
    ...styleBase,
    color: 'black',
    borderRight: '3px solid #dee2e6',
}
