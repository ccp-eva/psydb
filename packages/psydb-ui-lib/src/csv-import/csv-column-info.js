import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useToggleReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

// NOTE: columns = [{
//     csvkey, typeLabel?, examples?: [],
//     description? (key or list of keys), descriptionProps?, isRequired?
// }]
// exampleCSV = { filename, header: [], rows: [[]] }
const CSVColumnInfo = (ps) => {
    var { columns, exampleCSV } = ps;
    var [ isOpen, toggleOpen ] = useToggleReducer(false);

    return (
        <div>
            <Toggler
                isOpen={ isOpen }
                toggleOpen={ toggleOpen }
                exampleCSV={ exampleCSV }
            />
            { isOpen && (
                <div className='px-3 py-2 bg-white border mb-3'>
                    { columns.map((it, ix) => (
                        <React.Fragment key={ it.csvkey }>
                            { ix > 0 && <hr className='my-2' /> }
                            <ColumnItem { ...it } />
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

const ColumnItem = (ps) => {
    var {
        csvkey,
        typeLabel,
        examples = [],
        description,
        descriptionProps,
        isRequired
    } = ps;

    var [{ translate }] = useI18N();

    return (
        <div className='d-flex flex-column'>
            <div>
                <b>{ csvkey }</b>
                <span className='text-muted ml-2'>
                    ({ translate(isRequired
                        ? '_csvColumnInfo_required'
                        : '_csvColumnInfo_optional'
                    )})
                </span>
                { typeLabel && (
                    <span className='text-muted ml-2'>{ typeLabel }</span>
                )}
            </div>
            { examples.length > 0 && (
                <div>
                    { translate('_csvColumnInfo_examples') }:{' '}
                    { examples.map((it, ix) => (
                        <React.Fragment key={ ix }>
                            { ix > 0 && ', ' }<code>{ it }</code>
                        </React.Fragment>
                    ))}
                </div>
            )}
            { description && (
                <div><i>
                    { [].concat(description).map(it => (
                        translate(it, descriptionProps)
                    )).join(' ') }
                </i></div>
            )}
        </div>
    )
}

const Toggler = (ps) => {
    var { isOpen, toggleOpen, exampleCSV } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <div className='d-flex justify-content-end align-items-center'>
            <Button variant='link' onClick={ toggleOpen }>
                { isOpen ? (
                    translate('Hide Available Columns')
                ) : (
                    translate('Show Available Columns')
                )}
            </Button>
            { exampleCSV && (
                <Button
                    size='sm' variant='primary'
                    onClick={ () => downloadCSV(exampleCSV) }
                >
                    { translate('Download Example') }
                </Button>
            )}
        </div>
    )
}

var downloadCSV = (bag) => {
    var { filename, header, rows } = bag;
    var content = [ header, ...rows ].map(
        (row) => row.map(escapeCSVValue).join(';')
    ).join('\r\n') + '\r\n';

    // NOTE: BOM so that excel detects utf-8
    var blob = new Blob([ '\ufeff', content ], {
        type: 'text/csv;charset=utf-8'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

var escapeCSVValue = (value) => {
    var str = (value === undefined || value === null) ? '' : String(value);
    return (
        /[";\r\n]/.test(str)
        ? `"${str.replace(/"/g, '""')}"`
        : str
    );
}

export default CSVColumnInfo;
