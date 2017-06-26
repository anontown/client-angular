import { Pipe, PipeTransform } from '@angular/core';
import * as Immutable from 'immutable';

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
    transform(value: Immutable.List<any>): any {
        if (!value){
            return value;
        }
        return value.reverse();
    }
}