import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { calculateAge } from '@mpieva/psydb-common-lib';

import {
    useUILanguage,
    useUITranslation,
    useUILocale
} from '@mpieva/psydb-ui-contexts';

import { Icons } from '@mpieva/psydb-ui-layout';
import datefns from '../../date-fns';

var collectionUIMapping = {
    'subject': 'subjects',
    'researchGroup': 'research-groups',
    'location': 'locations',
    'study': 'studies',
    'personnel': 'personnel',
    'externalPerson': 'external-persons',
    'externalOrganization': 'external-organizations',
    'systemRole': 'system-roles',
}

// TODO: put elsewhere
const NoValue = (ps) => {
    var { unknown } = ps;
    var translate = useUITranslation();

    return (
        unknown
        ? translate('Unknown')
        : (
            <i style={{ color: '#bbb' }}>{ translate('Not Specified') }</i>
        )
    )
};

// TODO: put elsewhere
const Joined = ({ delimiter, children }) => (
    children.reduce((acc, it, ix) => ([
        ...acc,
        it,

        ix < children.length - 1
        ? delimiter
        : null
    ]), [])
)

export const Lambda = (ps) => {
    var { record, definition } = ps;
    var { fn, input } = definition.props;
    
    var translate = useUITranslation();
    
    if (!record) {
        return <span className='text-danger'>'ERROR'</span>
    }

    if (fn === 'deltaYMD') {
        fn = (it) => it ? calculateAge({
            base: it,
            relativeTo: new Date(),
            asString: true
        }) : translate('Unknown');
    }
    
    return (
        <span>
            { fn(jsonpointer.get(record, input)) }
        </span>
    );

}

export const SaneString = (ps) => {
    var { value } = ps;
    if (!value) {
        return <NoValue />
    }
    return (
        <span>{ String(value) }</span>
    );
}

export const SaneStringList = (ps) => {
    var { value } = ps;
    
    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    var formatted = (
        value
        .map((it, ix) => (
            <span key={ ix }>
                { it }
            </span>
        ))
    );
    
    return (
        <Joined delimiter=', '>{ formatted }</Joined>
    )
}

export const URLStringList = (ps) => {
    var { value } = ps;
    
    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    return (
        value.map((it, ix ) => (
            <div key={ ix }>
                <a href={ it } target='_blank'>{ it }</a>
            </div>
        ))
    );
}

export const FullText = (ps) => {
    var { value } = ps;
    return (
        value ? (
            <div className='bg-white px-3 py-2 border'>
                { String(value).split(/\n/).map((it, ix) => (
                    <span key={ ix }>{ it }<br /></span>
                )) }
            </div>
        ) : <NoValue />
    );
}

export const HelperSetItemIdList = (ps) => {
    var { value, props, related } = ps;
    var { setId } = props;

    var [ language ] = useUILanguage();

    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    return (
        <span>{ value.map(it => {
            if (!related) {
                return it;
            }
            var relatedItem = related.relatedHelperSetItems[setId][it];
            return (
                (relatedItem.state.displayNameI18N || {})[language]
                || relatedItem.state.label
            )
        }).join(', ') }</span>
    )
}

export const HelperSetItemId = (ps) => {
    var { value, props, related } = ps;
    var { setId } = props;
    
    var [ language ] = useUILanguage();

    if (!value) {
        return <NoValue unknown={ props.displayEmptyAsUnknown } />
    }

    if (!related) {
        return value;
    }
    
    var relatedItem = related.relatedHelperSetItems[setId][value];
    return (
        (relatedItem.state.displayNameI18N || {})[language]
        || relatedItem.state.label
    )
}

export const ForeignIdList = (ps) => {
    var { value, props, related } = ps;
    var { collection, recordType } = props;
    
    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    var formatted = (
        value
        .map((it, ix) => (
            <ForeignId
                key={ ix }
                value={ it }
                props={ props }
                related={ related }
            />
        ))
    );
    
    return (
        <Joined delimiter=', '>{ formatted }</Joined>
    )
}

export const DateOnlyServerSide = (ps) => {
    var { value, props = {}, related } = ps;
    
    var translate = useUITranslation();
    var locale = useUILocale();
    
    var formatted = (
        value === undefined || value === null
        ? <NoValue />
        : datefns.format(new Date(value), 'P', { locale })
    );

    var age = calculateAge({
        base: value,
        relativeTo: new Date(),
        asString: true
    });

    return (
        <span>
            { formatted }
            { value && props.isSpecialAgeFrameField && (
                <>
                    {' '}
                    <span style={{ color: '#bbb' }}>
                        ({ translate('Age Today')}: { age })
                    </span>
                </>
            )}
        </span>
    )
}

export const DateTime = (ps) => {
    var { value, props, related } = ps;
    var locale = useUILocale();

    var formatted = (
        value === undefined || value === null
        ? '-' 
        : datefns.format(new Date(value), 'P p', { locale })
    );
    return (
        <span>{ formatted }</span>
    )
}

export const Address = (ps) => {
    var { value } = ps;
    
    if (!value) {
        return <NoValue />
    }
    
    return (
        <>
            <div>
                { value.street }
                {' '}
                { value.housenumber }
                {' '}
                { value.affix }
            </div>
            <div>
                { value.postcode }
                {' '}
                { value.city }
                {' '}
                ({ value.country})
            </div>
        </>
    )
}

export const EmailWithPrimaryList = (ps) => {
    var { value } = ps;
    var translate = useUITranslation();
    
    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    return (
        value.map((it, ix) => (
            <div key={ ix }>
                { it.email }
                {' '}
                { it.isPrimary && (
                    <span className='text-primary'>
                        ({ translate('primary') })
                    </span>
                )}
            </div>
        ))
    )
}

export const PhoneWithTypeList = (ps) => {
    var { value } = ps;
    var translate = useUITranslation();
    
    if (!(Array.isArray(value) && value.length)) {
        return <i className='text-muted'>{ translate('None') }</i>
    }

    var fieldOptions = {
        'business': 'geschäftlich',
        'private': 'privat',
        'mobile': 'mobil',
        'fax': 'Fax',
        'mother': 'Tel. Mutter',
        'father': 'Tel. Vater',
    }

    return (
        value.map((it, ix) => (
            <div key={ ix }>
                { it.number }
                {' '}
                ({ fieldOptions[it.type] })
            </div>
        ))
    )
}

export const PhoneList = (ps) => {
    var { value } = ps;
    
    if (!(Array.isArray(value) && value.length)) {
        return <NoValue />
    }

    return (
        value.join(', ')
    )
}

export const BiologicalGender = (ps) => {
    var { value } = ps;
    var translate = useUITranslation();

    if (!value) {
        return <NoValue />
    }

    var fieldOptions = {
        'female': translate('Female'),
        'male': translate('Male'),
        'unknown': translate('Unknown')
    }

    return fieldOptions[value];
}

export const ExtBool = (ps) => {
    var { value = 'unknown' } = ps;
    var translate = useUITranslation();

    var colorClasses = {
        'yes': 'text-primary',
        'no': 'text-danger',
        'unknown': 'text-grey',
    };

    var fieldOptions = {
        'yes': translate('Yes'),
        'no': translate('No'),
        'unknown': translate('Unbekannt'),
    };

    var icons = {
        'yes': Icons.CheckSquareFill,
        'no': Icons.XSquareFill,
        'unknown': Icons.Square
    }

    var OptionIcon = icons[value];
    return (
        <span className={ colorClasses[value] }>
            <OptionIcon
                style={{ marginTop: '-3px' }}
            />
            <span className='d-inline-block ml-2'>
                { fieldOptions[value] }
            </span>
        </span>
    )
}

export const DefaultBool = (ps) => {
    var { value } = ps;
    value = String(!!value);
    
    var translate = useUITranslation();

    var colorClasses = {
        'true': 'text-primary',
        'false': 'text-danger',
    };

    var fieldOptions = {
        'true': translate('Yes'),
        'false': translate('No'),
    };

    var icons = {
        'true': Icons.CheckSquareFill,
        'false': Icons.XSquareFill,
    }

    var OptionIcon = icons[value];
    return (
        <span className={ colorClasses[value] }>
            <OptionIcon
                style={{ marginTop: '-3px' }}
            />
            <span className='d-inline-block ml-2'>
                { fieldOptions[value] }
            </span>
        </span>
    )
}

export const ForeignId = (ps) => {
    var { value, props, related } = ps;
    var { collection, recordType } = props;
    if (!value) {
        return <NoValue unknown={ props.displayEmptyAsUnknown } />
    }
    
    var label = (
        related
        ? related.relatedRecordLabels[collection][value]._recordLabel
        : value
    );
    
    var collectionUI = collectionUIMapping[collection];
    if (collectionUI) {
        var uri = (
            recordType
            ? `#/${collectionUI}/${recordType}/${value}`
            : `#/${collectionUI}/${value}`
        );

        return (
            <a href={ uri }>{ label }</a>
        )
    }
    else {
        return label;
    }
}

export const Integer = (ps) => {
    return (
        ps.value === null
        ? <NoValue />
        : String(ps.value)
    );
}

export const CustomRecordTypeKey = (ps) => {
    var { value, props, related } = ps;
    var { collection } = props;
    if (!value) {
        return <NoValue />
    }
   
    var label = (
        related
        ? related.relatedCustomRecordTypes[collection][value].state.label
        : value
    );

    return label;
}
