import React, { useState } from 'react';
import { useRouteMatch, useLocation } from 'react-router-dom';
import { entries } from '@mpieva/psydb-core-utils';
import { URL } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import { Nav } from 'react-bootstrap';

export const DefaultRecordSideNav = (ps) => {
    var { record, __showRaw = false, __showDelete = false, ...pass } = ps;
    var { _id, _rohrpostMetadata } = record;

    var { core, versions, raw } = useLinks({ record, __showDelete });

    return (
        <Container { ...pass }>
            <LinkList links={ core } />
            { versions && (
                <>
                    <HR />
                    <b className='bs5 d-block'>Versionen</b>
                    <LinkList links={ versions } />
                </>
            )}
            { __showRaw && (
                <>
                    <HR />
                    <LinkList links={ raw } />
                </>
            )}
        </Container>
    )
}

const useLinks = (ps) => {
    var { record, __showDelete = false } = ps;
    var { _rohrpostMetadata } = record;

    var [{ translate }] = useI18N();
    var { url } = useRouteMatch();
    var hashurl = URL.hashify(url);

    var core = {
        [`${hashurl}/details`]: {
            label: translate('Details'),
            show: true, enabled: true,
        },
        [`${hashurl}/edit`]: {
            label: translate('Edit'),
            show: true, enabled: true,
        },
        [`${hashurl}/delete`]: {
            label: translate('Delete'),
            show: __showDelete, enabled: true
        },
    };

    var raw = {
        [`${hashurl}/raw`]: {
            label: translate('Raw Data'),
            show: true, enabled: true
        },
        [`${hashurl}/raw-history`]: {
            label: translate('Raw History'),
            show: true, enabled: true
        }
    }
    
    if (_rohrpostMetadata) {
        var versions = {};
        for (var it of _rohrpostMetadata.eventIds) {
            versions[`${hashurl}/version/${it}`] = {
                label: it, show: true, enabled: true
            }
        }
    }
    else {
        var versions = undefined;
    }

    return { hashurl, core, versions, raw }
}

const LinkList = (ps) => {
    var { links, } = ps;

    var location = useLocation();
    var current = URL.hashify(location.pathname);

    var out = [];
    for (var [ href, item ] of entries(links)) {
        var active = href === current;
        out.push(
            <Link key={ href } href={ href } { ...item } active={ active } />
        )
    }

    return out;
}

const Link = (ps) => {
    var { href, label, show = true, enabled = true, active = false } = ps;
    
    if (!show) {
        return null;
    }

    var style = styleInactive;
    if (!enabled) {
        style = styleDisabled;
    }
    if (enabled && active) {
        style = styleActive;
    }

    return (
        <a style={ style } href={ enabled ? href : undefined }>
            { label }
        </a>
    )
}

const Container = (ps) => {
    var { style, className, children } = ps;
    var [ isCollapsed, setIsCollapsed ] = useState(false);
    var toggle = () => setIsCollapsed(!isCollapsed);
    
    return (
        <nav style={ style } className={ className }>
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

DefaultRecordSideNav.useLinks = useLinks;
DefaultRecordSideNav.Container = Container;
DefaultRecordSideNav.LinkList = LinkList;
DefaultRecordSideNav.Link = Link;
DefaultRecordSideNav.HR = HR;

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
