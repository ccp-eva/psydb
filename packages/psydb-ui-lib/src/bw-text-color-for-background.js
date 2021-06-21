import calculatePerceivedBrightness from '@mpieva/psydb-common-lib/src/perceived-brightness';

const bwTextColorForBackground = (bgColor) => (
    calculatePerceivedBrightness(bgColor) > 150
    ? '#212529'
    : '#ffffff'
);

export default bwTextColorForBackground;
