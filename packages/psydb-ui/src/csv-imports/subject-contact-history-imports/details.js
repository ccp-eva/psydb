import React from 'react';
import { useParams } from 'react-router-dom';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    SplitPartitioned,
    Grid,
    DetailsBox,
} from '@mpieva/psydb-ui-layout';

import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';
import { CSVImport } from '@mpieva/psydb-ui-lib/data-viewers';

//import RelatedExperiments from './related-experiments';
import RelatedItems from './related-subject-contact-history-items';

const Details = (ps) => {
    var { id: csvImportId } = useParams();
    var [{ translate }] = useI18N();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCSVExperimentImport({ id: csvImportId })
    ), [ csvImportId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    var csvImportBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var title = translate('CSV Import Details')
    return (
        <>
            <CSVImport { ...csvImportBag }>
                <DetailsBox title={ title }>
                    <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                        <div>
                            {/*<CSVImport.StudyId __useNewRelated />*/}
                            <CSVImport.Type />
                            <CSVImport.FileId />
                        </div>
                        <div>
                            <CSVImport.CreatedAt />
                            <CSVImport.CreatedBy __useNewRelated />
                        </div>
                    </Grid>
                </DetailsBox>
            </CSVImport>

            <div className='mt-4'>
                <RelatedItems csvImportId={ csvImportId } />
            </div>
        </>
    )
}

export default Details;
