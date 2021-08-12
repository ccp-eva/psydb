import React from 'react';
import { Redirect } from 'react-router-dom';

import RecordTypeNav from './record-type-nav';

const RedirectOrTypeNav = ({
    baseUrl,
    subjectTypes,
    title,
}) => {
    if (subjectTypes.length === 1) {
        return (
            <Redirect to={
                `${baseUrl}/${subjectTypes[0].type}`
            } />
        )
    }
    else {
        return (
            <>
                { title && (
                    <h2>{ title }</h2>
                )}
                <RecordTypeNav items={ subjectTypes } />
            </>
        )
    }
}

export default RedirectOrTypeNav;
