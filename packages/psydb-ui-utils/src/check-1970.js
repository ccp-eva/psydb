// NOTE: this is really hacky but we have
// old stuff in db that didnt have proper timestamps so we used
// unix(0) as fallback
const check1970 = (that) => {
    if (that instanceof Date) {
        that = that.toISOString();
    }
    return that === '1970-01-01T00:00:00.000Z';
}

export default check1970;
