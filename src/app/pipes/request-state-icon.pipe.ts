import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestStateIcon'
})
export class RequestStateIconPipe implements PipeTransform {

  transform(code: number): string {
    const icons = {
        0: 'food_bank',
        1: 'checkroom',
        2: 'weekend',
        3: 'school',
        4: 'emoji_transportation',
        5: 'medical_services',
        6: 'payments'
    };
    return icons[code];
  }

}
