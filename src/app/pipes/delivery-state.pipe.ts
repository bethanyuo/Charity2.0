import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryState'
})
export class DeliveryStatePipe implements PipeTransform {

  transform(code: number): string {
    return ['pending','started', 'ended'][code];
  }
}
