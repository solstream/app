import {CreateDatePipe} from './create-date.pipe';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

describe('CreateDatePipe', () => {

    const pipe = new CreateDatePipe();

    it('should test fromNow()', () => {
        const aFewSecondsAgo = dayjs().subtract(2, 'seconds').toDate();
        const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();
        const oneHourAgo = dayjs().subtract(1, 'hour').toDate();
        const twoHoursAgo = dayjs().subtract(2, 'hours').toDate();
        const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
        const oneYearAgo =  dayjs().subtract(1, 'year').toDate();

        expect(pipe.transform(aFewSecondsAgo)).toEqual('a few seconds ago');
        expect(pipe.transform(fiveMinutesAgo)).toEqual('5 minutes ago');
        expect(pipe.transform(oneHourAgo)).toEqual('an hour ago');
        expect(pipe.transform(twoHoursAgo)).toEqual('2 hours ago');
        expect(pipe.transform(oneMonthAgo)).toEqual('a month ago');
        expect(pipe.transform(oneYearAgo)).toEqual('a year ago');
    });
});
