import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from './service';

@Pipe({ name: 'config' })
export class ConfigPipe implements PipeTransform {
    private _config: ConfigService;

    constructor(config: ConfigService) {
        this._config = config;
    }

    transform(value: string) {
        return this._config.get(value);
    }
}
