import React from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';

const LinkQ64 = (ps) => {
    var { href, payload, ...pass} = ps;
    var q = JsonBase64.encode(payload);

    return (
        <a href={ `${href}/?q=${q}`} { ...pass } />
    )
}

export default LinkQ64;
