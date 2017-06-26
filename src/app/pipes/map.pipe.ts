import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'map' })
export class MapPipe implements PipeTransform {
    transform(map: Map<any, any>): any {
        if (map === null) {
            return null;
        }
        let result: { key: any, value: any }[] = [];
        map.forEach((value, key) => result.push({ key, value }));
        return result;
    }
}