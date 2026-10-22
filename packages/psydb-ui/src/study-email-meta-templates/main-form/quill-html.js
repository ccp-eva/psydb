import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

// NOTE: quill snow default toolbar without 'link'; links are not part
// of formats either so pasted links are stripped down to their text
var modules = {
    toolbar: [
        [{ header: [ '1', '2', '3', false ] }],
        [ 'bold', 'italic', 'underline' ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [ 'clean' ],
    ]
};
var formats = [
    'header', 'bold', 'italic', 'underline', 'list',
];

export const QuillHTML = withField({
    Control: (ps) => {
        var {
            dataXPath, formikField, formikForm, disabled,
            minHeight = '400px',
        } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        // NOTE: quill sizes its editing area by content so we
        // need to set the min height on the inner .ql-editor
        return (
            <div className='bg-white quill-html'>
                <style>{`
                    .quill-html .ql-editor { min-height: ${minHeight}; }
                `}</style>
                <ReactQuill
                    value={ value || '' }
                    readOnly={ disabled }
                    modules={ modules }
                    formats={ formats }
                    onChange={ (next) => setFieldValue(dataXPath, next) }
                />
            </div>
        )
    }
})
