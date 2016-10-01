import { Injectable, Inject, Provider } from "@angular/core";

export interface IConfigInterface {
    [name: string]: any;
}

@Injectable()
export class ConfigService {
    private _items: IConfigInterface;

    constructor(items: IConfigInterface) {
        this._items = items || {};
    }

    get(path: string, defaultValue?: any) {
        let value = this._items;

        if (path == null) {
            return value;
        }

        if(path in value) {
            return value[path];
        }
        const keys = path.split('.');

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
                value = undefined;
                break;
            }
            value = value[key];
        }

        return value !== undefined ? value : defaultValue;
    }

    set(path: string, value: any) {
        const keys: string[] = path.split('.');
        let nested = this._items;

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if(i !== len - 1) {
                if (!Object.prototype.hasOwnProperty.call(nested, key)) nested[key] = {};
                nested = nested[key];
            }
            else {
                nested[key] = value;
            }
        }
    }

    has(path: string) {
        const keys:string[] = path.split('.');
        let value = this._items;

        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];

            if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
                return false;
            }
            value = value[key];
        }

        return true;
    }

    all(): IConfigInterface {
        return this._items;
    }
}

export function provideConfig(config: IConfigInterface = {}): Provider[] {
    return [
        {
            provide: ConfigService,
            deps: [],
            useFactory: () => {
                return new ConfigService(config);
            }
        }
    ];
}
