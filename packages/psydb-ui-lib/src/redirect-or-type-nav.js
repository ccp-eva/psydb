import React from 'react';
import { Redirect } from 'react-router-dom';

import RecordTypeNav from './record-type-nav';

const RedirectOrTypeNav = ({
    baseUrl,
    subjectTypes,
    recordTypes,
    title,
}) => {
    if (subjectTypes) {
        recordTypes = subjectTypes; // FIXME
    }

    if (recordTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${recordTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ recordTypes } />
            </>
        )
    }
}

export default RedirectOrTypeNav;
