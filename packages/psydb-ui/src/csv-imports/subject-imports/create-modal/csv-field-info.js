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
                exampleColumns: [[ csvkey, address_samples[subkey] ]],
            });
            continue;
        }

        // NOTE: the dot form i.e. 'phones[0].type' still works but is
        // not advertised since it confuses most people
        if (systemType === 'PhoneWithTypeList') {
            columns.push({
                pointer, csvkey, typeLabel,
                examples: ft_examples.Phone,
                description: '_csvColumnInfo_fieldtype_PhoneWithTypeList',
                descriptionProps: { csvkey },
                isRequired: !!requiredByPointer[pointer],
                exampleColumns: listSampleColumns({
                    csvkey, samples: ft_samples.PhoneList
                }),
            });
            continue;
        }
        if (systemType === 'EmailList') {
            columns.push({
                pointer, csvkey, typeLabel,
                examples: ft_examples.Email,
                description: '_csvColumnInfo_fieldtype_EmailList',
                descriptionProps: { csvkey },
                isRequired: !!requiredByPointer[pointer],
                exampleColumns: listSampleColumns({
                    csvkey, samples: ft_samples.EmailList
                }),
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
            exampleColumns: (
                !isSupported ? []
                : /List$/.test(systemType) ? listSampleColumns({
                    csvkey, samples: ft_samples[systemType]
                })
                : [[ csvkey, ft_samples[systemType] ]]
            ),
        });
    }

    var { formOrder = [] } = subjectCRT.getRaw();
    var orderIndex = (it) => {
        var ix = formOrder.indexOf(it.pointer);
        return (ix === -1 ? Infinity : ix);
    };
    columns.sort((a, b) => orderIndex(a) - orderIndex(b));

    var exampleColumns = columns.flatMap(it => it.exampleColumns);
    var exampleCSV = {
        filename: `example-${subjectType}.csv`,
        header: exampleColumns.map(([ col ]) => col),
        rows: [ 0, 1 ].map(ix => (
            exampleColumns.map(([ col, samples ]) => samples[ix])
        )),
    };

    return <CSVColumnInfo columns={ columns } exampleCSV={ exampleCSV } />
}

// NOTE: lists get two columns i.e. 'tags[0]' and 'tags[1]'
// samples are [ [ row1_item0, row1_item1 ], [ row2_item0, row2_item1 ] ]
const listSampleColumns = (bag) => {
    var { csvkey, samples } = bag;
    return [ 0, 1 ].map(itemIx => ([
        `${csvkey}[${itemIx}]`,
        samples.map(rowItems => rowItems[itemIx]),
    ]));
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

// NOTE: static data for the example csv; one value per subject row
const address_samples = {
    street: [ 'Musterstraße', 'Musterweg' ],
    housenumber: [ '6', '12' ],
    affix: [ 'WHG 5', 'HH' ],
    postcode: [ '04277', '04109' ],
    city: [ 'Leipzig', 'Leipzig' ],
    country: [ 'DE', 'DE' ],
}

const ft_samples = {
    'SaneString': [ 'Some Words', 'Other Words' ],
    'FullText': [ 'Lorem ipsum dolor sit amet', 'Consectetur adipiscing' ],
    'Integer': [ '12', '7' ],
    'DefaultBool': [ 'true', 'false' ],
    'ExtBool': [ 'yes', 'unknown' ],
    'DateTime': [ '1953-05-31T12:00:00.000Z', '2001-12-20T08:30:00.000Z' ],
    'DateOnlyServerSide': [ '31.05.1953', '20.12.2001' ],
    'HelperSetItemId': [ '35', '36' ],
    'ForeignId': [ '44321', '44322' ],
    'BiologicalGender': [ 'female', 'male' ],
    'Email': [ 'alice@example.com', 'bob@example.com' ],
    'Phone': [ '+49 151 7953677', '030/123123' ],

    // lists: per row [ item0, item1 ]
    'HelperSetItemIdList': [ [ '35', '37' ], [ '36', '' ] ],
    'ForeignIdList': [ [ '44321', '44323' ], [ '44322', '' ] ],
    'PhoneList': [
        [ '+49 151 7953677', '0341/123123' ],
        [ '030/123123', '' ]
    ],
    'EmailList': [
        [ 'alice@example.com', 'alice.work@example.com' ],
        [ 'bob@example.com', '' ]
    ],
    'SaneStringList': [ [ 'Lorem', 'Ipsum' ], [ 'Dolor', '' ] ],
    'URLStringList': [
        [ 'https://example.com', 'https://example.org' ],
        [ 'https://example.net', '' ]
    ],
}

// NOTE: same as in psydb-schema-fields PhoneWithTypeList
const DEFAULT_PHONE_TYPES = [
    'business', 'private', 'mobile', 'fax', 'mother', 'father'
];

// NOTE: types not listed here (e.g. GeoCoords) cannot be imported
// via csv currently
const ft_examples = {
    'SaneString': [ 'Lorem ipsum' ],
    'FullText': [ 'Lorem ipsum dolor sit amet' ],
    'Integer': [ '12' ],
    'DefaultBool': [ 'true', 'false' ],
    'ExtBool': [ 'yes', 'no', 'unknown' ],
    'DateTime': [ '1953-05-31T12:00:00.000Z' ],
    'DateOnlyServerSide': [ '31.05.1953', '1953-05-31' ],
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
