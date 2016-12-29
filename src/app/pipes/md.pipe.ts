import * as marked from 'marked';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'md' })
export class MdPipe implements PipeTransform {
    transform(value: string): any {
        return marked.parse(value, { sanitize: true });
    }
}