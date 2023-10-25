import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(input: any): any {
    if (input && input.length) {
      return input.slice().reverse();
    }
    return input;
  }
}
