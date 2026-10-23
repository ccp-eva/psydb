import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useToggleReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

// NOTE: columns = [{
//     csvkey, examples?: [], description?, isRequired?
// }]
const CSVColumnInfo = (ps) => {
    var { columns } = ps;
    var [ isOpen, toggleOpen ] = useToggleReducer(false);

    return (
        <div>
            <Toggler isOpen={ isOpen } toggleOpen={ toggleOpen } />
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
        examples = [],
        description,
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
                <div><i>{ translate(description) }</i></div>
            )}
        </div>
    )
}

const Toggler = (ps) => {
    var { isOpen, toggleOpen } = ps;
    var [{ translate }] = useI18N();

    return (
        <div className='d-flex justify-content-end'>
            <Button variant='link' onClick={ toggleOpen }>
                { isOpen ? (
                    translate('Hide Available Columns')
                ) : (
                    translate('Show Available Columns')
                )}
            </Button>
        </div>
    )
}

export default CSVColumnInfo;
