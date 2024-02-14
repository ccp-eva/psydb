import React from 'react';
import { Redirect } from 'react-router-dom';

import RecordTypeNav from './record-type-nav';

const RedirectOrTypeNav = (ps) => {
    var {
        baseUrl,
        subjectTypes,
        recordTypes,
        title,
        related,
        enableRedirect = true
    } = ps;

    if (subjectTypes) {
        recordTypes = subjectTypes; // FIXME
    }

    if (enableRedirect && recordTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${recordTypes[0].type || recordTypes[0]}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav
                    items={ recordTypes }
                    related={ related }
                />
            </>
        )
    }
}

export default RedirectOrTypeNav;
