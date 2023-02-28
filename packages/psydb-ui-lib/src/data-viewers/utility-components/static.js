import React from 'react';
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
const NoValue = () => (
    <i className='text-muted'>Keine Angabe</i>
);

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

export const SaneString = (ps) => {
    var { value } = ps;
    return (
        <span>{ String(value) }</span>
    );
}

export const FullText = (ps) => {
    var { value } = ps;
    return (
        <div className='bg-white px-3 py-2 border'>
            { String(value).split(/\n/).map((it, ix) => (
                <span key={ ix }>{ it }<br /></span>
            )) }
        </div>
    );
}

export const HelperSetItemIdList = (ps) => {
    var { value, props, related } = ps;
    var { setId } = props;
    
    if (!(Array.isArray(value) && value.length)) {
        return <i className='text-muted'>Keine Angabe</i>
    }

    return (
        <span>{ value.map(it => (
            related
            ? related.relatedHelperSetItems[setId][it].state.label
            : it
        )).join(', ') }</span>
    )
}

export const HelperSetItemId = (ps) => {
    var { value, props, related } = ps;
    var { setId } = props;

    return (
        related
        ? related.relatedHelperSetItems[setId][value].state.label
        : value
    );
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
    var { value, props, related } = ps;
    var formatted = (
        value === undefined || value === null
        ? '-' 
        : datefns.format(new Date(value), 'dd.MM.yyyy')
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
                        (primär)
                    </span>
                )}
            </div>
        ))
    )
}

export const PhoneWithTypeList = (ps) => {
    var { value } = ps;
    
    if (!(Array.isArray(value) && value.length)) {
        return <i className='text-muted'>Keine</i>
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
    var { value = 'unknown' } = ps;

    var fieldOptions = {
        'female': 'Weiblich',
        'male': 'Männlich',
        'unknown': 'Unbekannt'
    }

    return fieldOptions[value];
}

export const ExtBool = (ps) => {
    var { value = 'unknown' } = ps;

    var colorClasses = {
        'yes': 'text-primary',
        'no': 'text-danger',
        'unknown': 'text-grey',
    };

    var fieldOptions = {
        'yes': 'Ja',
        'no': 'Nein',
        'unknown': 'Unbekannt',
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

    var colorClasses = {
        'true': 'text-primary',
        'false': 'text-danger',
    };

    var fieldOptions = {
        'true': 'Ja',
        'false': 'Nein',
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
        return <NoValue />
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
