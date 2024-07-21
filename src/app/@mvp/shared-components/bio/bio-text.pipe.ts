import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bioText'
})
export class BioTextPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return  value.split('\n').join('<br>');
  }

}
