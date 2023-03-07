import React from 'react';

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
                        Entfernen
                    </a>
                )}
            </td>
        </tr>
    );
}

var Empty = () => (
    <span
        className="m-l-sm block"
        style={{ color: '#bbb', paddingTop: '5px' }}
    >
        Keine
    </span>
);

export default FileList;
