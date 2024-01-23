import React, { useState } from 'react';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { Fields, useFormikContext } from '../../../../formik';

const LocationField = (ps) => {
    var { labMethodSettings, subjectType } = ps;
    var { values, setFieldValue } = useFormikContext();

    return (

    );
}

export default LocationField;
