import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

@Pipe({ name: 'createDateFormat' })
export class CreateDatePipe implements PipeTransform {
    transform(value: string | Date): string {
        dayjs.extend(relativeTime);
        return dayjs(value).fromNow();
    }
}
