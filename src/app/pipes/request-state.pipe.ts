import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestState'
})
export class RequestStatePipe implements PipeTransform {

  transform(code: number): string {
    return ['Food', 'Clothing', 'Furniture', 'Education', 'Transport', 'Medical', 'Funding'][code];
  }

}
