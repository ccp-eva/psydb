import React from 'react';
import { UploadModalBody } from '@mpieva/psydb-ui-lib';
import { withField, useFormikTheme } from '@mpieva/psydb-ui-lib';

export const CSVUploadField = withField({
    onChangeReceivesEvents: false,
    isThemed: false,
    Control: (ps) => {
        var { saneFormikField } = ps;
        var { onChange: onSuccessfulFileUpload } = saneFormikField;
        
        var theme = useFormikTheme();
        var Wrapper = theme.getWrapperForFieldControl({
            DefaultWrapper: 'FieldWrapper',
        }, ps);

        return (
            <Wrapper { ...ps }>
                <div className='m-2 border bg-white'>
                    <UploadModalBody
                        onHide={ () => {} }
                        accept='text/csv'
                        maxSize={ 10 * 1024 * 1024 }
                        onSuccessfulFileUpload={ onSuccessfulFileUpload }
                        onFailedFileUpload={ () => {} }
                        mulitiple={ false }
                    />
                </div>
            </Wrapper>
        )
    }
});
