import React from 'react';
import { without } from '@mpieva/psydb-core-utils';
import InternalControl from './internal-control';

const FileUploadControl = (ps) => {
    var { value, onChange, multiple, ...pass } = ps;
    
    var bag = {
        ...pass,
        files: value,
        multiple,
        onSuccessfulFileUpload: (files) => (
            multiple
            ? onChange([ ...value, ...files.map(it => it._id)])
            : onChange(files[0]._id)
        ),
        onRemove: (id) => (
            multiple
            ? onChange(without(value, id))
            : onChange(null)
        )
    };

    return (
        <InternalControl { ...bag } />
    );
}

export default FileUploadControl;
