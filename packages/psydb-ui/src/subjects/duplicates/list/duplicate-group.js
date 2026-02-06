import React from 'react';
import { useRouteMatch, useLocation } from 'react-router';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { URL } from '@mpieva/psydb-ui-utils';
import { TableBodyCustomCols } from '@mpieva/psydb-custom-fields-ui';

import LinkQ64 from './link-q64';

const DuplicateGroup = (ps) => {
    var { items, recordType, inspectedFields, related } = ps;

    var { url } = useRouteMatch();
    var { search } = useLocation();
    var [{ translate }] = useI18N();

    var hashurl = URL.hashify(url);
    var sharedBag = { inspectedFields, related };
    return (
        <tr>
            <TableBodyCustomCols
                record={ items[0] }
                related={ related }
                definitions={ inspectedFields }
            />
            <td>
                { items.map((it, ix) => (
                    <b className='bg-light' key={ ix }>
                        <a
                            className='d-inline-lock border mr-2 px-2'
                            href={`#/subjects/${recordType}/${it._id}`}
                            target='_blank'
                        >
                            { it._label }
                        </a>
                    </b>
                ))}
            </td>
            <td>
                <div
                    className='d-flex justify-content-end'
                    style={{ marginTop: '-5px', marginBottom: '-5px' }}
                >
                    <LinkQ64
                        className='btn btn-primary btn-sm m-0'
                        href={`${hashurl}/inspect`}
                        payload={{
                            items, inspectedFields,
                            backlink: `${url}${search}`
                        }}
                    >
                        { translate('Inspect') }
                    </LinkQ64>
                </div>
            </td>
        </tr>
    )
}

export default DuplicateGroup;
