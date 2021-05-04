// XXX: theese are mpi constants
const DAY = 24*60*60*1000;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

const calculateAge = ({
    base,
    relativeTo
}) => {
    base = new Date(base);
    relativeTo = new Date(relativeTo);

    var delta = relativeTo.getTime() - base.getTime();

    var years = Math.floor(delta / YEAR);
    delta -= years * YEAR;
    var months = Math.floor(delta / MONTH);
    delta -= months * MONTH;
    var days = Math.floor(delta / DAY);

    return `${years}/${months}/${days}`;
}

export default calculateAge;
