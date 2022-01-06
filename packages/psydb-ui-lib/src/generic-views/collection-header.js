import React from 'react';
import { LinkContainer } from '@mpieva/psydb-ui-layout';

// TODO: put this somewhere
var collectionDisplayNames = {
    'location': 'Locations',
    'subject': 'Probanden',
    'study': 'Studien',
    'researchGroup': 'Forschungsgruppen',
    'personnel': 'Mitarbeiter',
    'systemRole': 'System-Rollen',
    'externalPerson': 'Externe Personen',
    'externalOrganization': 'Externe Organisationen',
    'helperSet': 'Hilfstabellen'
}

const CollectionHeader = ({
    url,
    collection
}) => {
    return (
        <header>
            <h1 className='m-0 border-bottom'>
                <LinkContainer to={ url }>
                    <span role='button'>
                        {
                            collectionDisplayNames[collection]
                                || collection
                        }
                    </span>
                </LinkContainer>
            </h1>
        </header>
    )
}

export default CollectionHeader;
