import React from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';

export const LinkQ64 = (ps) => {
    var { href, payload, ...pass } = ps;
    var q = JsonBase64.encode(payload);

    return (
        <a href={ `${href}/?q=${q}`} { ...pass } />
    )
}
