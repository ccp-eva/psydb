import React, { useState, useEffect, useReducer } from 'react';
import jsonpointer from 'jsonpointer';

const MailTextPreview = ({
    mailText,
    allSubjectPlaceholders,
    previewSubject,
}) => {
    if (!mailText) {
        return null;
    }

    for (var it of allSubjectPlaceholders) {
        mailText = mailText.replaceAll(
            `{{${it.key}}}`,
            jsonpointer.get(previewSubject, it.dataPointer)
        );
    }

    return (
        <>
            <header><b>Preview</b></header>
            <div 
                className='bg-white border p-3'
                dangerouslySetInnerHTML={{ __html: mailText }}
            />
        </>
    )
}

export default MailTextPreview
