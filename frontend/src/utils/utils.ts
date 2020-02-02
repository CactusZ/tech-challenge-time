import moment from "moment";

export function differenceBetweenMoments(end: moment.Moment,start: moment.Moment) {
    const seconds=end.diff(start,"seconds") % 60;
    const minutes=end.diff(start,"minutes") % 60;
    const hours=end.diff(start,"hours");
    return `${twoSigns(hours)}:${twoSigns(minutes)}:${twoSigns(seconds)}`;
}

function twoSigns(num: number) {
    return num < 10 ? `0${num}` : num;
}