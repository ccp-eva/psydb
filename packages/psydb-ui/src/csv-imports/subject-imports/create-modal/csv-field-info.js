import React from 'react';
import { keyBy, convertPathToPointer } from '@mpieva/psydb-core-utils';
import { CSVColumnRemappers } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { CSVColumnInfo } from '@mpieva/psydb-ui-lib/csv-import';


const CSVFieldInfo = (ps) => {
    var { importerType, subjectType } = ps;
    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            collection: 'subject', recordType: subjectType, wrap: true
        })
    ), [ importerType, subjectType ]);

    if (!didFetch) {
        return null;
    }

    var subjectCRT = fetched.data;
    var remapper = CSVColumnRemappers.SubjectDefault({ subjectCRT })

    var defintionsByPointer = keyBy({
        items: subjectCRT.allFieldDefinitions(),
        byProp: 'pointer'
    });
    var requiredByPointer = keyBy({
        items: subjectCRT.findRequiredCustomFields(),
        byProp: 'pointer'
    })

    var columns = [];
    for (var [ csvkey, path ] of Object.entries(remapper.mappings.csv2obj)) {
        var pointer = convertPathToPointer(path);
        var definition = defintionsByPointer[pointer];

        // NOTE: address parts i.e. 'address.street' point into the field
        var subkey = undefined;
        if (!definition) {
            subkey = pointer.split('/').pop();
            pointer = pointer.replace(/\/[^/]+$/, '');
            definition = defintionsByPointer[pointer];
        }

        if (definition.props?.readOnly) {
            continue;
        }

        var { systemType } = definition;
        var typeLabel = translate(`_fieldtype_${systemType}`);
        if (systemType === 'Address') {
            columns.push({
                pointer, csvkey, typeLabel,
                ...addressPartInfo({ subkey, props: definition.props }),
            });
            continue;
        }

        if (systemType === 'PhoneWithTypeList') {
            var isRequired = !!requiredByPointer[pointer];
            columns.push({
                pointer, csvkey: `${csvkey}[0].number`, typeLabel,
                examples: ft_examples.Phone,
                description: '_csvColumnInfo_phoneWithType_number',
                descriptionProps: { csvkey },
                isRequired,
            }, {
                pointer, csvkey: `${csvkey}[0].type`, typeLabel,
                examples: (
                    definition.props?.numbertypes || DEFAULT_PHONE_TYPES
                ),
                description: '_csvColumnInfo_phoneWithType_type',
                descriptionProps: { csvkey },
            });
            continue;
        }

        var isSupported = !!ft_examples[systemType];
        columns.push({
            pointer,
            csvkey,
            typeLabel,
            examples: ft_examples[systemType],
            description: (
                isSupported
                ? `_csvColumnInfo_fieldtype_${systemType}`
                : '_csvColumnInfo_fieldtype_unsupported'
            ),
            descriptionProps: { csvkey },
            isRequired: !!requiredByPointer[pointer],
        });
    }

    var { formOrder = [] } = subjectCRT.getRaw();
    var orderIndex = (it) => {
        var ix = formOrder.indexOf(it.pointer);
        return (ix === -1 ? Infinity : ix);
    };
    columns.sort((a, b) => orderIndex(a) - orderIndex(b));

    return <CSVColumnInfo columns={ columns } />
}

// NOTE: the address as a whole is always optional; parts that are
// required by the field settings must be given once any part is given
const addressPartInfo = (bag) => {
    var { subkey, props = {} } = bag;
    var cap = subkey[0].toUpperCase() + subkey.slice(1);
    var isPartRequired = !!props[`is${cap}Required`];

    var description = [ `_csvColumnInfo_address_${subkey}` ];
    if (isPartRequired) {
        description.push('_csvColumnInfo_address_requiredPart');
    }
    else {
        if (subkey === 'country') {
            description.push('_csvColumnInfo_address_countryFallback');
        }
        description.push('_csvColumnInfo_address_optionalPart');
    }

    return {
        examples: address_examples[subkey],
        description,
        isRequired: false,
    };
}

const address_examples = {
    street: [ 'Musterstraße' ],
    housenumber: [ '6' ],
    affix: [ 'WHG 5', 'HH' ],
    postcode: [ '04277' ],
    city: [ 'Leipzig' ],
    country: [ 'DE' ],
}

// NOTE: same as in psydb-schema-fields PhoneWithTypeList
const DEFAULT_PHONE_TYPES = [
    'business', 'private', 'mobile', 'fax', 'mother', 'father'
];

// NOTE: types not listed here (e.g. EmailList, GeoCoords)
// cannot be imported via csv currently
const ft_examples = {
    'SaneString': [ 'Lorem ipsum' ],
    'FullText': [ 'Lorem ipsum dolor sit amet' ],
    'Integer': [ '12' ],
    'DefaultBool': [ 'true', 'false' ],
    'ExtBool': [ 'yes', 'no', 'unknown' ],
    'DateTime': [ '1953-05-31T12:00:00.000Z' ],
    'DateOnlyServerSide': [ '1953-05-31', '31.05.1953' ],
    'HelperSetItemId': [ '35' ],
    'HelperSetItemIdList': [ '35' ],
    'ForeignId': [ '44321' ],
    'ForeignIdList': [ '44321' ],
    'BiologicalGender': [ 'female', 'male', 'other', 'unknown' ],
    'Email': [ 'alice@example.com' ],
    'Phone': [ '+49 151 7953677', '030/123123' ],
    'PhoneList': [ '+49 151 7953677', '030/123123' ],
    'SaneStringList': [ 'Lorem ipsum' ],
    'URLStringList': [ 'https://example.com' ],
}

export default CSVFieldInfo;
