import * as Variants from './variants';

const switchVariant = ({ type }) => {
    switch (type) {
        case 'default':
            return Variants.DefaultVariant;
        default:
            throw new Error(`unknown type ${type}`)
    }
}

export default switchVariant;
