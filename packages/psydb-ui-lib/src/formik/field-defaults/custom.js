import { range } from '@mpieva/psydb-core-utils';

export const Custom = (options) => {
    var { fieldDefinitions, subChannelKey } = options;
    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );
    
    return fields.reduce((acc, it) => ({
        ...acc,
        [it.key]: CustomFieldDefault(it)
    }), {})
}

const CustomFieldDefault = (options) => {
    var { type, props } = options;
    type = fixSystemType(type);
    
    switch (type) {
        case 'SaneString':
            return '';
        case 'DefaultBool':
            return false;

        case 'DateOnlyServerSide':
        case 'DateTime':
        case 'ExtBool':
        case 'BiologicalGender':
        case 'ForeignId':
        case 'HelperSetItemId':
            return undefined;

        case 'EmailWithPrimaryList':
        case 'PhoneWithTypeList':
            var { minItems } = props;
            return range(minItems || 0).map(() => ({}));

        case 'HelperSetItemIdList':
        case 'ForeignIdList':
            var { minItems } = props;
            return range(minItems || 0).map(() => undefined);
        default:
            throw new Error(`unknown systemType "${type}"`)
    }
}

const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};
