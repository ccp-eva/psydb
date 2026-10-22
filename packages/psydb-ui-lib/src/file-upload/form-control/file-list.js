import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const FileList = (ps) => {
    var { records = [], onRemove, canRemove, multiple } = ps;
    var sharedBag = { onRemove, canRemove, multiple };

    if (records.length < 1) {
        return <Empty />
    }

    return (
        <table className="m-l-sm" style={{ marginTop: '5px' }}>
            <tbody>
                { records.map((it, ix) => (
                    <Row key={ ix } file={ it } { ...sharedBag } />
                ))}
            </tbody>
        </table>
    );
};

const Row = (ps) => {
    var translate = useUITranslation();
    var { file, multiple, onRemove, canRemove } = ps;
    
    return (
        <tr>
            <td className='bs5 p-0'>{ file.originalName }</td>
            <td className='bs5 p-0'>
                { canRemove && (
                    <a
                        className='bs5 d-inline-block'
                        onClick={ () => onRemove(file._id, { multiple }) }
                    >
                        { translate('Remove') }
                    </a>
                )}
            </td>
        </tr>
    );
}

var Empty = () => {
    var translate = useUITranslation();
    return (
        <span
            className="m-l-sm block"
            style={{ color: '#bbb', paddingTop: '5px' }}
        >
            { translate('None') }
        </span>
    );
}

export default FileList;
