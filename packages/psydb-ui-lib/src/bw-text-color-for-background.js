import calculatePerceivedBrightness from '@mpieva/psydb-common-lib/src/perceived-brightness';

const bwTextColorForBackground = (bgColor) => (
    calculatePerceivedBrightness(bgColor) > 150
    ? '#000000'
    : '#ffffff'
);

export default bwTextColorForBackground;
