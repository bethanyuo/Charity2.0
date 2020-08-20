import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryStateIcon'
})
export class DeliveryStateIconPipe implements PipeTransform {

  transform(code: number): string {
    const icons = {
        0: 'pending',
        1: 'local_shipping',
        2: 'assignment_turned_in'
    };
    return icons[code];
  }
}
