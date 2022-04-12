import React from 'react';
import { Fields } from '../../../formik';

export const InviteFields = (ps) => {
    var { settings, related } = ps;
    var { locations } = settings.state;

    return (
        <>
            <Fields.GenericEnum
                label='Raum'
                dataXPath='$.locationId'
                options={ locations.reduce((acc, it) => {
                    var type = it.customRecordTypeKey;
                    var id = it.locationId;

                    var typeLabel = (
                        related.crts.location[type].state.label
                    );
                    var idLabel = (
                        related.records.location[id]._recordLabel
                    )

                    return { ...acc, [id]: `${typeLabel} - ${idLabel}` }
                }, {}) }
            />
        </>
    );
}
