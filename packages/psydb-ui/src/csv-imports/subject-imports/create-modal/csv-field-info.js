import React from 'react';
import { keyBy, convertPathToPointer } from '@mpieva/psydb-core-utils';
import { CSVColumnRemappers } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useToggleReducer } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Grid, Button } from '@mpieva/psydb-ui-layout';


const CSVFieldInfo = (ps) => {
    var { importerType, subjectType } = ps;
    
    var [{ translate }] = useI18N();
    var [ isOpen, toggleOpen ] = useToggleReducer(true);
    
    var infoBag = { importerType, subjectType };
    var toggleBag = { isOpen, toggleOpen };
    
    return (
        <div>
            <Toggler { ...toggleBag }/>
            { isOpen && (
                <div className='px-3 py-2 bg-white border mb-3'>
                    <Grid cols={[ '250px', '400px', '1fr' ]}>
                        <AllColInfos { ...infoBag } />
                    </Grid>
                </div>
            )}
        </div>
    )
}

const AllColInfos = (ps) => {
    var { importerType, subjectType } = ps;
    var [{ translate }] = useI18N();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection: 'subject', recordType: subjectType, wrap: true
        })
    ), [ importerType, subjectType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var subjectCRT = fetched.data;
    var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT })
    var columns = Object.keys(remapper.mappings.csv2obj).sort();

    var defintionsByPointer = keyBy({
        items: subjectCRT.allFieldDefinitions(),
        byProp: 'pointer'
    });

    return Object.entries(remapper.mappings.csv2obj).map(
        ([ csvkey, path ], ix) => {
            var pointer = convertPathToPointer(path);
            var definition = defintionsByPointer[pointer];
            return (
                <ColInfo key={ ix }
                    csvkey={ csvkey } definition={ definition } />
            )
        }
    )
}

const ColInfo = (ps) => {
    var { csvkey, definition } = ps;
    var { systemType } = definition;
    var [{ translate }] = useI18N();

    return (
        <>
            <b>{ csvkey }</b>
            <span>{ translate(`_fieldtype_${systemType}`) }</span>
            <span>{ ft_examples[systemType] }</span>
        </>
    )
}

const ft_examples = {
    'SaneString': 'Some Simple Phrase',
    'FullText': 'Long text with\nline breaks.',
    'Integer': '12',
    'DefaultBool': 'true | false',
    'ExtBool': 'yes, no, unknown',
    'DateTime': '1953-05-31T12:00:00.000Z',
    'DateOnlyServerSide': '1953-05-31',
    'HelperSetItemId': '35',
    'HelperSetItemIdList': '12,44,51',
    'ForeignId': '44321',
    'ForeignIdList': '775,4431,13378',
    'BiologicalGender': 'female | male | unknown | (other)',
    'Email': 'alice@example.com',
    'Phone': '+49 1234/55667788',
    // Address, GeoCoords
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

export default CSVFieldInfo;
