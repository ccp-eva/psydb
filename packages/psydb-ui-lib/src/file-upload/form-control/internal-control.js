import React, { useState } from 'react';
import { arrify } from '@mpieva/psydb-core-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';

import { Uploader } from '../uploader';
import FileList from './file-list';


const InternalControl = (ps) => {
    var {
        controlLabel,
        files: fileIds,
        canRemove,
   
        onSuccessfulFileUpload,
        onRemove,

        accept,
        maxSize,
        multiple,
        context: fileContext,
        ...unused
    } = ps;

    fileIds = (
        fileIds ? arrify(fileIds) : []
    );

    var [ cachedRecords, setCachedRecords ] = useState([]);
    var [ didFetch, fetched ] = useFetch(({ agent }) => (
        fileIds.length < 1
        ? undefined
        : (
            agent.listFiles({
                fileIds,
                projection: { _id: true, originalName: true }
            })
        )
    ), {
        dependencies: [ /* once */ ],
        extraEffect: (response) => {
            setCachedRecords(response.data.data.records);
        }
    });

    if (!didFetch) {
        return <LoadingIndicator size='sm' />
    }

    return (
        <div>
            <FileList
                records={ fileIds.map(id => (
                    cachedRecords.find(cached => cached._id === id)
                )).filter(it => !!it) }
                onRemove={ (id) => {
                    onRemove(id, { multiple });
                    // FIXME: we shoudl create helper for that
                    var tmp = [ ...cachedRecords ];
                    var removeIndex = tmp.findIndex((it) => (
                        it._id === id
                    ));
                    tmp.splice(removeIndex, 1);

                    setCachedRecords(tmp);
                }}
                canRemove={ canRemove }
                multiple={ multiple }
            />

            <Uploader
                label={ multiple ? 'Dateien hochladen' : 'Datei hochladen' }
                accept={ accept }
                multiple={ multiple }
                maxSize={ maxSize }
                fileContext={ fileContext }
                onSuccessfulFileUpload={ (files) => {
                    var stripped = (
                        files.map(({ _id, originalName }) => ({
                            _id, originalName
                        }))
                    );
                    
                    if (multiple) {
                        setCachedRecords([
                            ...cachedRecords,
                            ...stripped,
                        ]);
                    }
                    else {
                        setCachedRecords(stripped);
                    }

                    onSuccessfulFileUpload(files, { multiple })
                }}
            />
        </div>
    )
};


export default InternalControl;
