import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';

const MailTextPreview = (ps) => {
    var { previewInfo, mailText } = ps;

    if (!mailText) {
        return null;
    }

    var { mapping, record } = previewInfo;

    for (var it of mapping) {
        var { pointer, previewKey } = it;
        mailText = mailText.replaceAll(
            `{{${previewKey}}}`,
            jsonpointer.get(record, pointer)
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
